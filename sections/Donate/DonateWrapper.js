import styled from 'styled-components'
import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi";
import {useState} from 'react'

import BalanceComponent from '../../components/functional/BalanceComponent'
import ApprovedComponent from '../../components/functional/ApprovedComponent'
import Button from "../../components/buttons/Button";
import ApproveButton from "../../components/buttons/ApproveButton";
import { SuccessIcon } from "../../components/icons/Common";
import donation from "../../abi/donation.json";

const DonateButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 3%;
  gap: 1rem;
`;


const DonateWrapper = ({amountM, amountD, pid, blockchain}) => {
    const { address } = useAccount();
    const token = process.env.NEXT_PUBLIC_AD_TOKEN
    const [explorer, setExplorer] = useState('https://mumbai.polygonscan.com/tx/')

    const { config, error } = usePrepareContractWrite({
        addressOrName: process.env.NEXT_PUBLIC_AD_DONATOR,
        contractInterface: donation.abi,
        functionName: 'contribute',
        args: [amountM, amountD, pid],
    });

    const { write, isSuccess, data } = useContractWrite(config);

    const handleSubmit = async () => {
        await write?.()
        if (blockchain === 'polygon') {
            setExplorer('https://mumbai.polygonscan.com/tx/')
        } else if (blockchain === 'bsc') {
            setExplorer('https://bscscan.com/tx/')
        }
    }
    const sum = parseInt(amountM) + parseInt(amountD);

    return <div>
        <DonateButtonWrapper>
            {isSuccess ? <SuccessIcon /> : (
                <>
                    {address &&
                    <div>
                        <BalanceComponent address={address} token={token} amount={sum} />
                        <ApprovedComponent address={address} />
                    </div>}
                    <ApproveButton sum={sum} />
                </>
            )}
            <div>
                {!isSuccess && (
                    <>
                        {error ? <Button text='Donate' width={'200px'} error /> : <Button disabled={!write} onClick={() => handleSubmit?.()} text='Send funds' width={'200px'} />}
                    </>
                )}{(!error && isSuccess) && <a href={`${explorer}${data.hash}`} target="_blank" rel="noopener noreferrer"><Button text="Transaction detail" /></a>}
            </div>
        </DonateButtonWrapper>
    </div>
}

export default DonateWrapper