import { useState } from "react";
import "./App.css";

function App() {
  // Estado para el barco seleccionado
  const [selectedShip, setSelectedShip] = useState({
    type: '',
    size: 0
  });

  // Estado para la orientación del barco
  const [isHorizontal, setIsHorizontal] = useState(true);

  // Estado para los tableros (jugador y ataques)
  const [playerBoard, setPlayerBoard] = useState(Array(9).fill().map(() => Array(10).fill(null)));
  const [attackBoard, setAttackBoard] = useState(Array(9).fill().map(() => Array(10).fill(null)));
  
  // Estado para los ataques recibidos
  const [receivedAttacks, setReceivedAttacks] = useState(Array(9).fill().map(() => Array(10).fill(false)));

  // Estado para barcos colocados
  const [placedShips, setPlacedShips] = useState([]);

  // Definición de barcos y sus colores
  const ships = {
    "PortaAvion(5 casillas)": { size: 5, name: "PortaAvion", color: "#FF0000" }, // Rojo
    "Acorazado(4 casillas)": { size: 4, name: "Acorazado", color: "#00FF00" }, // Verde
    "Destructor (3 casillas)": { size: 3, name: "Destructor", color: "#800080" }, // Púrpura
    "Submarino(3 casillas)": { size: 3, name: "Submarino", color: "#FFA500" }, // Naranja
    "crucero(2 casillas)": { size: 2, name: "Crucero", color: "#808080" } // Gris
  };

  const handleShipSelect = (e) => {
    const shipName = e.target.value;
    if (placedShips.includes(shipName)) {
      alert('Este barco ya ha sido colocado');
      e.target.value = '';
      return;
    }
    setSelectedShip({
      type: shipName,
      size: ships[shipName]?.size || 0
    });
  };

  // Manejo de ataques en el tablero superior
  const handleAttack = (row, col) => {
    const newAttackBoard = [...attackBoard];
    const newReceivedAttacks = [...receivedAttacks];
    
    // Simulación de ataque (aquí conectarías con la lógica del oponente)
    const isHit = Math.random() < 0.5; // Simulación
    
    newAttackBoard[row][col] = isHit ? 'hit' : 'miss';
    setAttackBoard(newAttackBoard);
  };

  // Manejo de click en celda para colocar barcos
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

    // Verificar si hay barcos en el camino
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

    // Colocar el barco
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
    document.getElementById('inputState').value = '';
  };

  const toggleOrientation = () => {
    setIsHorizontal(!isHorizontal);
  };

  const indexToLetter = (index) => String.fromCharCode(65 + index);

  // Renderizado del tablero de ataques
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
                  attackBoard[rowIndex][colIndex] === 'hit' ? 'bg-warning' : 
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

  // Renderizado del tablero del jugador
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
                className={`border border-primary`}
                style={{
                  backgroundColor: playerBoard[rowIndex][colIndex] 
                    ? ships[playerBoard[rowIndex][colIndex]].color 
                    : '',
                  ...(receivedAttacks[rowIndex][colIndex] && {
                    backgroundColor: playerBoard[rowIndex][colIndex] ? '#FFD700' : '#0000FF'
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
      <div className="col-md-6">
        <label htmlFor="inputCity" className="form-label">columna</label>
        <input type="text" className="form-control" id="inputCity"/>
      </div>
      <div className="col-md-6">
        <label htmlFor="inputCity" className="form-label">fila</label>
        <input type="text" className="form-control" id="inputCity"/>
      </div>
      <button type="button" className="btn btn-success">Atacar</button>
    </div>
  );
}

export default App;