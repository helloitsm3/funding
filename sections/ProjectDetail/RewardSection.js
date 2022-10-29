import styled from "styled-components";
import { useState } from 'react'
import axios from 'axios'
import { TabRow, TooltipBox, IconBox } from "../start_project/SetRewards/StyleWrapper";
import InputContainer from "../../components/form/InputContainer";
import Tab from "../../components/form/Tab";
import Tooltip from "../../components/Tooltip";
import { InfoIcon } from "../../components/icons/Common";
import { Row } from "../../components/format/Row";
import { NextButton } from "../start_project/Category/StyleWrapper";
import Link from "next/link";

const RewardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-left: 18%;
  padding-right: 18%;
  margin-top: 3%;
`

const MainContainer = styled.div`
  padding-top: 5%;
  margin-bottom: 10%;
  animation: fadeIn 0.7s;
    @keyframes fadeIn {
        0% {
        opacity: 0;
        }
        100% {
        opacity: 1;
        }
    }
`

const MilestoneTitle = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const MainMilestoneContainer = styled.div`
  margin-top: 20px;
  background: linear-gradient(132.28deg, rgba(47, 47, 47, 0.3) -21.57%, rgba(0, 0, 0, 0.261) 100%);
  border: 1px solid #3C3C3C;
  border-radius: 5px;
  width: 100%;
  padding: 5%;
  border-radius: 10px;
`;

const MilestoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px;
`;


const RewardSection = ({objectId, bookmarks, title}) => {
    const pType = "Standard" // Until stream is implemented
    const [rType, setRType] = useState('Microfund')
    const [microTooltip, setMicroTooltip] = useState(false)
    const [donationTooltip, setDonationTooltip] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [reward, setReward] = useState({
        title: "Godspeed",
        description: "Jesus will smile on you",
        amount: 100,
        type: "Donate",  // OR Donate OR Stream // OR Microfund
        tokenAmount: "10", // optional 
        tokenName: "EYE", // optional
        tokenUrl: "https://polygonscan.com/token/0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    })


    const moralisApiConfig = {
        headers: {
          "X-Parse-Application-Id": `${process.env.NEXT_PUBLIC_DAPP_ID}`,
          "Content-Type": "application/json"
        }
    }
    
    const handleReward = async (oid) => {
        try {
          await axios.put(`${process.env.NEXT_PUBLIC_DAPP}/classes/Project/${oid}`, { 'state': 2 }, moralisApiConfig) /// This is wrong, rewrite to array
          setSuccess(true)
          setError(false)
          handleRewardNotifications
        } catch (error) {
          setError(true)
        }
      }

    const handleRewardNotifications = async () => {
        if (bookmarks) {
          bookmarks.forEach(async (bookmark) => {
            await axios.post(`${process.env.NEXT_PUBLIC_DAPP}/classes/Notification`, {
              'title': 'Reward opportunity added',
              'description': `Owner of project ${title} added new reward opportunity.`,
              'type': 'rewardAdded',
              'user': bookmark
            }, moralisApiConfig)
          })
        }
      }
    return <MainContainer>
        <RewardContainer>
            <MainMilestoneContainer>
                <MilestoneContainer>
                    <TabRow> {pType === 'Standard' && <Tab o1={'Microfund'} o2={'Direct donate'} onClick={() => { setRType('Donate') }} />}
                        <TooltipBox>
                            {microTooltip && <Tooltip text={'Microfund creators will get rewards for setting specific maximum cap, even though total amount does not have to be completely transferred to your project at the end. Higher number of microfunds positively impacts following donations.'} />}
                            {donationTooltip && <Tooltip text={'Fixed pledge given by direct donation. Standard Kickstarter-like backing experience with no extra magic around. With reward for direct donation backer knows for certain, how much value will be spend at the end for this reward.'} />}
                        </TooltipBox>
                    </TabRow>
                    {rType === 'Microfund' && <InputContainer
                        label={'Amount'}
                        placeholder={'1000'}
                        onChange={(e) => setReward((prev) => ({ ...prev, amount: e.target.value }))}
                        description={
                            <Row>Microfund cap amount
                                <IconBox onMouseEnter={() => setMicroTooltip(true)} onMouseLeave={() => setMicroTooltip(false)}>
                                    <InfoIcon width={15} />
                                </IconBox>
                            </Row>}
                        type={'number'}
                    />}
                    {rType === 'Donate' && <InputContainer
                        label={'Amount'}
                        placeholder={'1000'}
                        onChange={(e) => setReward((prev) => ({ ...prev, amount: e.target.value }))}
                        description={
                            <Row>Backed amount
                                <IconBox onMouseEnter={() => setDonationTooltip(true)} onMouseLeave={() => setDonationTooltip(false)}>
                                    <InfoIcon width={15} />
                                </IconBox>
                            </Row>}
                        type={'number'}
                    />}
                    <InputContainer
                        label={'Title'}
                        placeholder={'Godspeed'}
                        description={'Create a unique title for your reward'}
                        onChange={(e) => setReward((prev) => ({ ...prev, title: e.target.value }))}
                        type={'textArea'}
                    />
                    <InputContainer
                        label={'Description'}
                        placeholder={'Backer receives autographed copy of the book'}
                        description={'Describe what backer receives for this reward'}
                        onChange={(e) => setReward((prev) => ({ ...prev, description: e.target.value }))}
                        type={'text'}
                    />
                    {!success && !error && <NextButton onClick={()=>{handleReward(objectId)}}>Create reward</NextButton>}
                    {error && <NextButton onClick={()=>{handleReward(objectId)}}>Error: Check your fields and retry</NextButton>}
                    {success && <Link href="/my"><NextButton>Success: Back to the overview</NextButton></Link>}
                </MilestoneContainer>
            </MainMilestoneContainer>
        </RewardContainer>
    </MainContainer>
}

export default RewardSection