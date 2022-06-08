import {ListGroup} from "react-bootstrap";
import styled from "styled-components";
import deleteIcon from "../../static/images/delete.png";
import editIcon from "../../static/images/edit.png";
import {usersApi} from "../../api/users-api";
import {toast} from "react-toastify";

const Delete = styled.img`
  width: 35px;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    background-color: #e77c79;
    cursor: pointer;
  }
`;

const Edit = styled.img`
  width: 35px;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    background-color: #7cce7c;
    cursor: pointer;

  }
`;

const User = ({user, onDelete, onSelect}) => {
    const selectUser = () => onSelect(user);

    const deleteUser = () => {
        usersApi.delete(user._id)
            .then(response => {
                const {status} = response;

                if (status === 200) {
                    onDelete(user._id)
                    toast.success('Пользователь удален', {autoClose: 1500})
                }
            })
            .catch(() => {
                toast.warn('Авторизуйтесь', {autoClose: 1500})
            })
    }


    return (
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
        >
            <div className="ms-2 me-auto">
                <div className="fw-bold text-break">{user.lastName} {user.firstName}</div>
                Возраст: {user.age}
            </div>
            <Edit
                src={editIcon}
                title={'Редактировать пользователя'}
                onClick={selectUser}
            />
            <Delete src={deleteIcon} title={'Удалить пользователя'} onClick={deleteUser}/>
        </ListGroup.Item>
    );
}

export default User;
