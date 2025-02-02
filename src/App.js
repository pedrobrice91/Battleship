import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [selectedShip, setSelectedShip] = useState({
    type: '',
    size: 0
  });
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [playerBoard, setPlayerBoard] = useState(Array(9).fill().map(() => Array(10).fill(null)));
  const [attackBoard, setAttackBoard] = useState(Array(9).fill().map(() => Array(10).fill(null)));
  const [receivedAttacks, setReceivedAttacks] = useState(Array(9).fill().map(() => Array(10).fill(null)));
  const [placedShips, setPlacedShips] = useState([]);
  

  const [opponentBoard, setOpponentBoard] = useState(Array(9).fill().map(() => Array(10).fill(null)));

  const ships = {
    "PortaAvion(5 casillas)": { size: 5, name: "PortaAvion", color: "#000000" },
    "Acorazado(4 casillas)": { size: 4, name: "Acorazado", color: "#00FF00" },
    "Destructor(3 casillas)": { size: 3, name: "Destructor", color: "#fafe00" },
    "Submarino(3 casillas)": { size: 3, name: "Submarino", color: "#FFA500" },
    "crucero(2 casillas)": { size: 2, name: "Crucero", color: "#808080" }
  };

  const placeOpponentShips = () => {
    const newBoard = Array(9).fill().map(() => Array(10).fill(null));
    
    Object.entries(ships).forEach(([shipName, shipData]) => {
      let placed = false;
      while (!placed) {
        const isHorizontal = Math.random() < 0.5;
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 10);
        
    
        if (isHorizontal && col + shipData.size > 10) continue;
        if (!isHorizontal && row + shipData.size > 9) continue;
      
        let spaceIsFree = true;
        for (let i = 0; i < shipData.size; i++) {
          if (isHorizontal) {
            if (newBoard[row][col + i] !== null) {
              spaceIsFree = false;
              break;
            }
          } else {
            if (newBoard[row + i][col] !== null) {
              spaceIsFree = false;
              break;
            }
          }
        }
        
        if (spaceIsFree) {
       
          for (let i = 0; i < shipData.size; i++) {
            if (isHorizontal) {
              newBoard[row][col + i] = shipName;
            } else {
              newBoard[row + i][col] = shipName;
            }
          }
          placed = true;
        }
      }
    });
    
    setOpponentBoard(newBoard);
  };


  useEffect(() => {
    placeOpponentShips();
  }, []);

  const handleAttack = (row, col) => {
    if (attackBoard[row][col] !== null) {
      return;
    }

    const newAttackBoard = [...attackBoard];
    const isHit = opponentBoard[row][col] !== null;
    newAttackBoard[row][col] = isHit ? 'hit' : 'miss';
    setAttackBoard(newAttackBoard);
  };

  const handleShipSelect = (e) => {
    const shipName = e.target.value;
    if (shipName === '') {
      setSelectedShip({ type: '', size: 0 });
      return;
    }
    
    if (placedShips.includes(shipName)) {
      alert('Este barco ya ha sido colocado');
      setSelectedShip({ type: '', size: 0 });
      e.target.value = '';
      return;
    }

    const ship = ships[shipName];
    if (ship) {
      setSelectedShip({
        type: shipName,
        size: ship.size
      });
    }
  };

  const renderAttackBoard = () => {
    return (
      <div>
        <h3>Tablero de Ataques</h3>
        <div className="d-flex">
          <div id="filaUno"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} id="filaUno">{i + 1}</div>
          ))}
        </div>
        {[...Array(9)].map((_, rowIndex) => (
          <div key={rowIndex} className="d-flex">
            <div id="filaUno">{indexToLetter(rowIndex)}</div>
            {[...Array(10)].map((_, colIndex) => (
              <div
                key={colIndex}
                id="filaUno"
                className={`border border-primary ${
                  attackBoard[rowIndex][colIndex] === 'hit' ? 'bg-danger' : 
                  attackBoard[rowIndex][colIndex] === 'miss' ? 'bg-info' : ''
                }`}
                onClick={() => handleAttack(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleReceivedAttack = (row, col) => {
    const newReceivedAttacks = [...receivedAttacks];
    const isHit = playerBoard[row][col] !== null;
    newReceivedAttacks[row][col] = isHit ? 'hit' : 'miss';
    setReceivedAttacks(newReceivedAttacks);
  };

  const handleCellClick = (row, col) => {
    if (!selectedShip.type) {
      alert('Por favor selecciona un barco primero');
      return;
    }

    const newBoard = [...playerBoard];
    
    if (isHorizontal && col + selectedShip.size > 10) {
      alert('No hay espacio suficiente en esta posición horizontal');
      return;
    }
    if (!isHorizontal && row + selectedShip.size > 9) {
      alert('No hay espacio suficiente en esta posición vertical');
      return;
    }

    for (let i = 0; i < selectedShip.size; i++) {
      if (isHorizontal) {
        if (newBoard[row][col + i] !== null) {
          alert('Ya hay un barco en esta posición');
          return;
        }
      } else {
        if (newBoard[row + i][col] !== null) {
          alert('Ya hay un barco en esta posición');
          return;
        }
      }
    }

    for (let i = 0; i < selectedShip.size; i++) {
      if (isHorizontal) {
        newBoard[row][col + i] = selectedShip.type;
      } else {
        newBoard[row + i][col] = selectedShip.type;
      }
    }

    setPlayerBoard(newBoard);
    setPlacedShips([...placedShips, selectedShip.type]);
    setSelectedShip({ type: '', size: 0 });
    const selectElement = document.getElementById('inputState');
    if (selectElement) {
      selectElement.value = '';
    }
  };

  const toggleOrientation = () => {
    setIsHorizontal(!isHorizontal);
  };

  const indexToLetter = (index) => String.fromCharCode(65 + index);

  const renderPlayerBoard = () => {
    return (
      <div>
        <h3>Mi Tablero</h3>
        <div className="d-flex">
          <div id="filaUno"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} id="filaUno">{i + 1}</div>
          ))}
        </div>
        {[...Array(9)].map((_, rowIndex) => (
          <div key={rowIndex} className="d-flex">
            <div id="filaUno">{indexToLetter(rowIndex)}</div>
            {[...Array(10)].map((_, colIndex) => (
              <div
                key={colIndex}
                id="filaUno"
                className="border border-primary"
                style={{
                  backgroundColor: playerBoard[rowIndex][colIndex] 
                    ? ships[playerBoard[rowIndex][colIndex]].color 
                    : '',
                  ...(receivedAttacks[rowIndex][colIndex] === 'hit' && {
                    backgroundColor: '#FF0000'
                  }),
                  ...(receivedAttacks[rowIndex][colIndex] === 'miss' && {
                    backgroundColor: '#00aaff'
                  })
                }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const simulateOpponentAttack = () => {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 10);
    handleReceivedAttack(row, col);
  };

  return (
    <div>
      <h1>Battleship!</h1>
      <div className="">
        {renderAttackBoard()}
        
        <div className="">
          {renderPlayerBoard()}
        </div>
      </div>
      
      <div className="col-md-4">
        <label htmlFor="inputState" className="form-label">Selecciona el barco</label>
        <select 
          id="inputState" 
          className="form-select"
          value={selectedShip.type}
          onChange={handleShipSelect}
        >
          <option value="">Choose...</option>
          {Object.entries(ships).map(([shipName, _]) => (
            <option 
              key={shipName} 
              value={shipName}
              disabled={placedShips.includes(shipName)}
            >
              {shipName}
            </option>
          ))}
        </select>
      </div>
      <button 
        type="button" 
        className="btn btn-secondary mt-2 mb-2"
        onClick={toggleOrientation}
      >
        Orientación: {isHorizontal ? 'Horizontal' : 'Vertical'}
      </button>
      
      <button 
        type="button" 
        className="btn btn-danger mt-2"
        onClick={simulateOpponentAttack}
      >
        Simular ataque del contrincante
      </button>
    </div>
  );
}

export default App;