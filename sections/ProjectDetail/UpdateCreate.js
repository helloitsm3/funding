import { useState } from 'react'
import axios from 'axios'
import InputContainer from "../../components/form/InputContainer";
import { NextButton } from "../start_project/Category/StyleWrapper";
import {MainMilestoneContainer, MilestoneContainer,MainContainer ,RewardContainer} from '../../components/form/InputWrappers'
import { useRouter } from 'next/router';



const UpdateCreate = ({objectId, bookmarks, title}) => {
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const [error, setError] = useState(false)
    const [url, setUrl] = useState('URL example')

    const moralisApiConfig = {
        headers: {
          "X-Parse-Application-Id": `${process.env.NEXT_PUBLIC_DAPP_ID}`,
          "Content-Type": "application/json"
        }
    }
    // HTTPS validation
    // Router.back
    
    const handleUpdate = async (oid) => {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_DAPP}/classes/Update`, { 
            'url': url,
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
                    {error && <NextButton onClick={()=>{handleUpdate(objectId)}}>Technical error: Please try again later</NextButton>}
                    {success && <NextButton onClick={() => router.push('/')}>Success: Back to the overview</NextButton>}
                </MilestoneContainer>
            </MainMilestoneContainer>
        </RewardContainer>
    </MainContainer>
}

export default UpdateCreate