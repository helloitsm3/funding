import styled from "styled-components"
import SectionTitle from "../../components/typography/SectionTitle"
import axios from 'axios'
import {useState, useEffect} from 'react'

const Container = styled.div`
    margin-top: 5%;
    color: white;
`

const List = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: 15%;
    font-family: 'Neucha';
`

const A = styled.a`
    padding: 2%;
    font-size: 1em;
    &:hover{
        opacity: 0.9;
    }
`

const Created = styled.div`
    color: #d0d0d0;   
    font-size: 0.8em;
`

const UpdateOverview = ({objectId}) => {
    const [updates, setUpdates] = useState([])

    useEffect(() => {
        getUpdates()
      }, []);

    const getUpdates = async () => {
        const config = {
            headers: {
                "X-Parse-Application-Id": `${process.env.NEXT_PUBLIC_DAPP_ID}`
            }
        }
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_DAPP}/classes/Update?where={"project":"${objectId}"}`, config)
            setUpdates(res.data.results)
        } catch (error) {
            console.log(error)
        }
    }
    // TBD format date
    return <Container>
        <SectionTitle title={'Project updates'}/>
        <List>
            {updates.length > 0 && 
                updates.map((update)=> 
                    <div key={update.objectId}>
                        <A href={`${update.url}`}><li>{update.title}</li></A>
                        <Created>{update.createdAt}</Created>
                  </div>)
            }        
        </List>
    </Container>
}

export default UpdateOverview