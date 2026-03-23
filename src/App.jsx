import './App.css'
import {useEffect, useState} from "react";

const DELETE = 1
const SET = 0

function App() {
  const word = "level".toUpperCase()

  const getInitialTable = () => {
    return Array.from({ length: 6 }, () =>
        Array.from({ length: 5 }, () => ({ letter: "", status: "empty" }))
    );
  };

  const [table, setTable] = useState(getInitialTable())

  const [pressedKey, setPressedKey] = useState("")

  const [tableIndex, setTableIndex] = useState({
    row: 0,
    col: 0
  })

  const setKeyInTable = (row, col, key, action) => {
    setTable(prevState =>{
      const newTable = [...prevState]

      newTable[row] = [...newTable[row]]

      newTable[row][col].letter = key

      if (action === DELETE)
        newTable[row][col].status = "empty"
      else if (action === SET)
        newTable[row][col].status = "colWithLetter"

      return newTable
    })
  }

  const renderTable = () => {
    return table.map((row, rowIndex) => {
      return (
          // Dodany atrybut key dla wiersza
          <div key={`row-${rowIndex}`} className={"row"}>
            {row.map((col, colIndex) => (
                // Dodany atrybut key dla kolumny
                <div key={`col-${rowIndex}-${colIndex}`} className={col.status}>
                  {col.letter}
                </div>
            ))}
          </div>
      );
    });
  };

  const renderRowAndCheckLetters = () => {
    let copiedWord = word

    let goodLetterAmount = 0
    for (let i = 0; i < 5; i++) {
      if (word[i] === table[tableIndex.row][i].letter) {
        copiedWord = copiedWord.replace(table[tableIndex.row][i].letter, " ")
        goodLetterAmount++;
        setTable(prevState =>{
          const newTable = [...prevState]

          newTable[tableIndex.row] = [...newTable[tableIndex.row]]

          newTable[tableIndex.row][i].status = "colGood"

          return newTable
        })
      }
    }
    for (let i = 0; i < 5; i++) {
      if (word[i] !== table[tableIndex.row][i].letter && copiedWord.includes(table[tableIndex.row][i].letter)) {
        copiedWord = copiedWord.replace(table[tableIndex.row][i].letter, " ")
        console.log(copiedWord)
        setTable(prevState =>{
          const newTable = [...prevState]

          newTable[tableIndex.row] = [...newTable[tableIndex.row]]

          newTable[tableIndex.row][i].status = "colMid"

          return newTable
        })
      }
      else if (word[i] !== table[tableIndex.row][i].letter && !copiedWord.includes(table[tableIndex.row][i].letter)){
        setTable(prevState =>{
          const newTable = [...prevState]

          newTable[tableIndex.row] = [...newTable[tableIndex.row]]

          newTable[tableIndex.row][i].status = "colNotGood"

          return newTable
        })
      }
    }

    if (goodLetterAmount === 5) {
      setTimeout(() => {
        alert("You won")
        setTable(getInitialTable())
        setTableIndex({row: 0, col: 0})
      }, 100)
    }
  }

  useEffect(() => {
    const keyDown = (event) => {
      setPressedKey(event.key);

      if (event.key === "Enter") {
        if (tableIndex.col === 5) {
          console.log("test")
          renderRowAndCheckLetters()
          setTableIndex(prevIndex => {
            return {
              col: 0,
              row: prevIndex.row + 1
            }
          })
        }
      }
      else if (event.key === "Backspace") {
        if (tableIndex.col > 0) {
          setKeyInTable(tableIndex.row, tableIndex.col - 1, "", DELETE)

          setTableIndex(prevState => {
            return {
              ...prevState,
              col: prevState.col - 1
            }
          })
        }
      }
      else {
        if (/^[a-zA-Z]$/.test(event.key)) {
          if (tableIndex.col < 5) {
            setKeyInTable(tableIndex.row, tableIndex.col, event.key.toUpperCase(), SET)

            setTableIndex(prevState => {
              return {
                ...prevState,
                col: prevState.col + 1
              }
            })
          }
        }
      }
    }

    window.addEventListener("keydown", keyDown)

    return () => {
      window.removeEventListener("keydown", keyDown)
    }

  }, [tableIndex]);

  return (
      <>
        <h1>wordleClone</h1>
        <main>
          <section>
            {renderTable()}
          </section>
        </main>
      </>
  )
}

export default App
