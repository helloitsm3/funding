import Image from "next/image"
import styled from "styled-components"
import { useState } from 'react'
import axios from 'axios'

import Tag from "../components/typography/Tag"
import SectionTitle from "../components/typography/SectionTitle"
import ImgSkeleton from "../components/skeletons/ImgSkeleton"
import Button from "../components/buttons/Button"
import Share from '../components/buttons/Share'
import { BookmarkIcon, BookmarkFilledIcon, CancelIcon } from '../components/icons/Common'
import Tooltip from '../components/Tooltip'
import { CanceledTypo } from '../components/icons/Typography'

import donation from '../abi/donation.json'
import { useContractWrite, usePrepareContractWrite, useContractEvent, useNetwork } from 'wagmi'

const Container = styled.div`
  margin-top: 5%;
`

const DetailBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid #2f2f2f;
  padding: 3%;
  padding-left: 5%;
  margin-top: 5%;
  margin-left: 15%;
  margin-right: 15%;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    margin: 1%;
    padding: 1%;
  }
`

const Desc = styled.div`
  margin-top: 2%;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 300;
  font-size: 1em;
  line-height: 20px;
  color: #ffffff;
`

const LeftPart = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 5%;
    margin-top: 5%;
  }
`

const RightPart = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 3px solid #b0f6ff;
  width: 50%;
  margin-left: 3%;
  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    margin-top: 5%;
    margin-bottom: 5%;
  }
`

const Categories = styled.div`
  margin-top: 2px;
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const RowBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 1.4%;
  padding-bottom: 0.5%;
`

const RowCol = styled.div`
  display: flex;
  flex-direction: column;
`
const RowTitle = styled.div`
  font-family: "Chenla";
  font-style: normal;
  font-size: 1.5em;
  font-weight: 400;
  color: ${(props) => props.color};
`

const RowDesc = styled.div`
  color: white;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
`

const FlexRow = styled.div`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
`

const Bkmrk = styled.div`
  display: flex;
  min-height: 30px;
  &:hover {
    cursor: pointer;
  }
`

const ActionPanel = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute; 
  right: 0;
  top: 0px;
  right: 4%;
`

const CancelProject = styled.button`
  position: relative;
  background: inherit;
  border: none;
  &:hover{
    cursor: pointer;
    opacity: 0.9;
  }
`

const CanceledBox = styled.div`
  position: absolute;
  transition: 0.5s;
  z-index: 1;
  top: -25%;
  right: 0;
  @media (max-width: 1068px) {
    top: 25%;
  }
`

// @param "my" indicates whether component visualized in context of MyProjects or Landing page
const ProjectDetail = ({ objectId, pid, title, description, category, subcategory, amPledged, amBackers, amGoal, amDays, image, microActive, my }) => {
  const [cancelTooltip, setCancelTooltip] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const { chain } = useNetwork()

  const { write, isLoading } = useContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_AD_DONATOR,
    contractInterface: donation.abi,
    functionName: 'cancelFund',
    args: [pid],
  })

  // TBD cancel events not implemented yet in smart contracts, needed to cover both POSITIVE and NEGATIVE cases

  // useContractEvent({
  //   addressOrName: process.env.NEXT_PUBLIC_AD_DONATOR,
  //   contractInterface: donation.abi,
  //   eventName: 'FundCanceled',
  //   listener: () => setSuccess(true),
  //   once: true
  // })

  const Bookmark = () => {
    return (
      <Bkmrk onClick={() => { handleBookmark() }}>
        {!marked ? <BookmarkIcon width={20} /> : <BookmarkFilledIcon width={20} />}
      </Bkmrk>
    )
  }

  const Row = ({ title, desc, right, color }) => {
    return (
      <RowBox>
        <RowCol>
          <RowTitle color={color}>{title}</RowTitle> <RowDesc>{desc}</RowDesc>
        </RowCol>
        {right}
      </RowBox>
    )
  }

  const cancel = async (oid, pid) => {
    await cancelMoralis(oid);
    await write(pid);
  }

  const cancelMoralis = async (oid) => {
    const config = {
      headers: {
        "X-Parse-Application-Id": `${process.env.NEXT_PUBLIC_DAPP_ID}`,
        "Content-Type": "application/json"
      }
    }
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_DAPP}/classes/Project/${oid}`, { 'state': 5 }, config)
      console.log(res)
      setSuccess(true)

    } catch (error) {
      console.log(error)
      setError(true)
    }
  }

  const [marked, setMarked] = useState(false)

  const handleBookmark = () => {
    setMarked(!marked)
    // TBD Tier 1 - https://app.clickup.com/t/32jy4wv
    // Push to bookmark array
    // Fix moving icon upon switch
    // Bookmarks could be handled only for authed users
  }

  const handleDonate = () => {
    // TBD https://app.clickup.com/t/327d8bc
    console.log('Donate')
  }


  return <Container>
    {my && <SectionTitle title={'Active project'} subtitle={title} />}
    <DetailBox>
      {success && <CanceledBox><CanceledTypo width={400} /></CanceledBox>}
      {my && <ActionPanel>
        {!success && !isLoading ? <>
          {chain && chain.name === 'Mumbai' ?
            <CancelProject onClick={() => { cancelMoralis(objectId, pid) }} onMouseEnter={() => { setCancelTooltip(true) }} onMouseLeave={() => { setCancelTooltip(false) }}>
              {cancelTooltip && <Tooltip text='Cancel project' />}
              <CancelIcon width={30} />
            </CancelProject> :
            <CancelProject onMouseEnter={() => { setCancelTooltip(true) }} onMouseLeave={() => { setCancelTooltip(false) }}>
              {cancelTooltip && <Tooltip text='Switch to Mumbai' />}
              <CancelIcon width={30} />
            </CancelProject>
          }</> : <>Loading</>}
      </ActionPanel>}
      <LeftPart>
        {!image ? <ImgSkeleton /> : <Image src={detail.image} alt={title} width={500} height={500} />}
        <Categories>
          {category && <Tag tag={category} color={"#000850"} />}
          {subcategory && <Tag tag={subcategory} color={"#035201"} />}
        </Categories>
        <Desc>{description}</Desc>
      </LeftPart>
      <RightPart>
        <div>
          <Row title={amPledged} desc={`pledged of ${amGoal} goal`} color="#00FFA3" right={<Bookmark />} />
          <Row title={amBackers} desc={`backers`} color="white" />
          <Row title={microActive} desc={`microfunds active`} color="white" />
          <FlexRow>
            <Row title={amDays} desc={`days to go`} color="white" />
            <Share fbQuote='fbQuote' twTitle='twTitle' twVia='twVia' liTitle='linked title' liSum='linked summary' liSource='linked source' />
          </FlexRow>
        </div>
        <div>
          <Button
            text="Fund it!"
            width={"100%"}
            onClick={() => { handleDonate() }}
          />
        </div>
      </RightPart>
    </DetailBox>
  </Container>
}

export default ProjectDetail