const getState = ({ getActions, getStore, setStore }) => {
    return {
      store: {
        accounts: [],
        isAuthenticated:
          JSON.parse(localStorage.getItem("isAuthenticated")) || false,
        userId: JSON.parse(localStorage.getItem("userId")) || null,
        userFullName: JSON.parse(localStorage.getItem("userFullName")) || "",
        accessToken: JSON.parse(localStorage.getItem("accessToken")) || null,
      },
      actions: {
        setIsAuthenticated: (value) => {
          setStore({ isAuthenticated: value });
          localStorage.setItem("isAuthenticated", JSON.stringify(value));
        },
        setUserId: (value) => {
          setStore({ userId: value });
          localStorage.setItem("userId", JSON.stringify(value));
        },
        setUserFullName: (firstName, lastName) => {
          setStore({ userFullName: firstName + "" + lastName });
          localStorage.setItem(
            "userFullName",
            JSON.stringify(firstName + " " + lastName)
          );
        },
  
        setAccessToken: (value) => {
          setStore({ accessToken: value });
          localStorage.setItem("jwt-token", value);
        },
        postToken: async (firstName, lastName, email) => {
          try {
            const response = await fetch("http://localhost:5050/login_google", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
              }),
            });
  
            if (!response.ok) {
              throw new Error("There is an error");
            }
  
            const data = await response.json();
            if (data.access_token) {
              localStorage.setItem("jwt-token", data.access_token);
            } else {
              console.error("Token not received in response");
            }
          } catch (error) {
            console.error("Error al enviar el token:", error);
          }
        },
        postFlow: async (nameFlow) => {
          const token = localStorage.getItem("jwt-token");
          if (!token) {
            console.error(
              "Token not found. User might not be authenticated.POST"
            );
            return;
          }
          try {
            console.log("entro al try");
            const response = await fetch("http://localhost:5050/account", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: nameFlow,
              }),
            });
            if (!response.ok) {
              throw new Error("There is an error");
            }
            getActions().getFlow();
          } catch (error) {
            console.error("Error al enviar el token post:", error);
          }
        },
        getFlow: async () => {
          const token = localStorage.getItem("jwt-token");
          if (!token) {
            console.error("Token not found. User might not be authenticated.");
            return;
          }
          try {
            const response = await fetch("http://localhost:5050/account", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (!response.ok) {
              throw new Error("There is an error");
            }
            const data = await response.json();
            setStore({
              accounts: data,
            });
          } catch (error) {
            console.error("Error al enviar el token get:", error);
          }
        },
        deleteFlow: (flowId) => {
          const token = localStorage.getItem("jwt-token");
          if (!token) {
            console.error("Token not found. User might not be authenticated.");
            return;
          }
          fetch(`http://localhost:5050/account/${flowId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                getActions().getFlow();
              }
            })
            .catch((error) => console.log(error));
        },
        updateStateFlow: (flowId, stateAccount) => {
          const token = localStorage.getItem("jwt-token");
          if (!token) {
            console.error("Token not found. User might not be authenticated.");
            return;
          }
          fetch(`http://localhost:5050/account/state/${flowId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error("Failed to update flow state");
              }
            })
            .then((data) => {
              console.log("Flow state updated successfully", data);
              getActions().getFlow();
            })
            .catch((error) => {
              console.error("Error updating flow state:", error);
            });
        },
      },
    };
  };
  
  export default getState;