import styled from "styled-components";
import { useState } from 'react'
import axios from 'axios'
import InputContainer from "../../components/form/InputContainer";
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
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [url, setUrl] = useState('URL example')

    const moralisApiConfig = {
        headers: {
          "X-Parse-Application-Id": `${process.env.NEXT_PUBLIC_DAPP_ID}`,
          "Content-Type": "application/json"
        }
    }

    // Update collection in the db
    // Display updates
    // HTTPS validation
    // Refactor container into /components/form
    // Refactor notification handler
    
    const handleUpdate = async (oid) => {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_DAPP}/classes/Update`, { 
            'url': {url},
            'project': oid 
          }, moralisApiConfig) /// This is wrong, rewrite to array
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
              'title': `UPDATE!! ${title}`,
              'description': `${url}`,
              'type': 'projectUpdate',
              'user': bookmark
            }, moralisApiConfig)
          })
        }
      }
    return <MainContainer>  
      <RewardContainer>
            <MainMilestoneContainer>
                <MilestoneContainer>
                    <InputContainer
                        label={'URL'}
                        placeholder={'https://updates.kickstarter.com/kickstarters-four-day-work-week/'}
                        description={'URL to the project update'}
                        onChange={(e) => setUrl(e.target.value)}
                        type={'text'}
                    />
                    {!success && !error && <NextButton onClick={()=>{handleUpdate(objectId)}}>Sent update notification</NextButton>}
                    {error && <NextButton onClick={()=>{handleReward(objectId)}}>Technical error: Please try again later</NextButton>}
                    {success && <Link href="/my"><NextButton>Success: Back to the overview</NextButton></Link>}
                </MilestoneContainer>
            </MainMilestoneContainer>
        </RewardContainer>
    </MainContainer>
}

export default RewardSection