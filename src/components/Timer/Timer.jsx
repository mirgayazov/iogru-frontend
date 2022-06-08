import {useTimer} from 'react-timer-hook';
import {useEffect} from "react";
import {toast} from "react-toastify";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 5px 15px 5px 5px;
`;

const Timer = ({token}) => {
    const time = new Date();
    const expiryTimestamp = time.setSeconds(time.getSeconds() + 900);

    const {
        seconds,
        minutes,
        restart
    } = useTimer({
        expiryTimestamp, onExpire: () => toast.warn('Токен просрочен, авторизуйтесь', {autoClose: 1500})
    });


    useEffect(() => {
        const time = new Date();

        if (token) {
            time.setSeconds(time.getSeconds() + 900);
        }

        restart(time);
    }, [token])

    return (
        <Wrapper>
            Токен действителен в течение <span>{minutes}</span>:<span>{seconds}</span>{' '}
        </Wrapper>
    );
}

export default Timer;
