import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 2%;
  margin-bottom: 2%;
  gap: 20px;
  width: 100%;
`

export const SiteContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50vw;
`

export const NextButton = styled.button`
  background-color: #3c4048;
  padding: 10px 20px;
  border-radius: 5px;

  background-color: #7bd3d3;
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin: 0;
  outline: none;
  padding: 10px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  &:hover {
    background-color: #9bffff;
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
`

export const MainContainer = styled.div`
  display: flex;
  justify-content: center;
`