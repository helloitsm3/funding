import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 80px;
  font-family: "Montserrat";
  .input_label {
    width: 20%;

  }

  .input_style {
    text-decoration: none;
    padding: 12px 10px;
    border-radius: 5px;
    border-style: none;
    width: 90%;
  }

  .input_description {
    font-size: 0.7em;
  }

  .input_container {
    width: 100%;
  }
`;

const InputContainer = ({label, placeholder,onChange, description, type}) => {
    return <Container>
        <label className="input_label">{label}</label>
        <div className="input_container">
            {type === 'number' &&  <input className="input_style" type="number" placeholder={placeholder} onChange={onChange}/> }
            {type === 'textArea' &&  <textarea className="input_style" type="text" placeholder={placeholder} onChange={onChange}/> }
            {type === 'text' && <input className="input_style" type="text" placeholder={placeholder} onChange={onChange} />}  
         <div className="input_description">{description}</div>
        </div>
    </Container>
}

export default InputContainer