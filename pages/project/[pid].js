import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { useMoralisQuery } from 'react-moralis'

import SectionTitle from "../../components/typography/SectionTitle"
import ProjectDetail from "../../sections/ProjectDetail"

// Blockchain related 
import donation from '../../abi/donation.json'
import { useContractRead } from 'wagmi'


const Container = styled.div`
  margin-top: 5%;
`

const Project = () => {
  const router = useRouter()
  const { pid } = router.query 

  const micros = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_AD_DONATOR,
    contractInterface: donation.abi,
    functionName: 'getConnectedMicroFunds',
    chainId: 80001,
    args: [pid],
    watch: false,
  })

  var microActive = ""
  
  if (micros.data){
    microActive = micros.data.toString()
  }


  const { data } = useMoralisQuery("Project", (query) => query.equalTo("pid", pid));
  const fetchDetail = JSON.parse(
    JSON.stringify(data, [
      "title",
      "description",
      "category",
      "subcategory",
    ]), [], { autoFetch: true },
  );


  const [image, setImage] = useState(null)
  const [title, setTitle] = useState("Default Title")
  const [description, setDescription] = useState("Default Description")
  const [category, setCategory] = useState(null)
  const [subcategory, setSubcategory] = useState(null)

  const [amPledged, setAmPledged] = useState("N/A")
  const [amBackers, setAmBackers] = useState("N/A")
  const [amMicro, setAmMicro] = useState("N/A")
  const [amDays, setAmDays] = useState("N/A")
  const [amGoal, setAmGoal] = useState("N/A")



  const getData = async () => {
    try {
      await setTitle(fetchDetail[0].title)
      await setDescription(fetchDetail[0].description)
      await setCategory(fetchDetail[0].category)
      await setSubcategory(fetchDetail[0].subcategory)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
  }, [!fetchDetail[0]])



  return (
    <>
      <Container>
        <SectionTitle title={"Project detail"} subtitle={title} />
        <ProjectDetail description={description} title={title} category={category} subcategory={subcategory} amBackers={amBackers} amMicro={amMicro} amPledged={amPledged} amDays={amDays} amGoal={amGoal} image={image} microActive={microActive} />
      </Container>
    </>
  )
}

export default Project
