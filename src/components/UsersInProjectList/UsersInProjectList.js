import React, { useEffect, useState } from 'react';
import { Row, Space, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';

const { Text } = Typography;

const UsersInProjectList = ({ project = [], mode }) => {
  const [users, setUsers] = useState();
  const [modal, setModal] = useState(false);
  const textColor = mode ? 'white' : 'black';
  const toggle = () => {
    setModal((previous) => !previous);
  };
  let friendListArray;
  if (project.users) {
    friendListArray = project.users.split(' ').filter((item) => item !== '');
    console.log(friendListArray);
  }
  const getUsers = () => {
    fetch('http://localhost:3000/getusers', {
      method: 'get',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('err');
        } else {
          setUsers(data);
        }
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const searchName = (value) => {
    if (value && users !== undefined) {
      const find = users.find((user) => user.email === value);
      let returning;
      if (find !== undefined) {
        returning = find.user.replace(' ', '');
      } else {
        returning = '';
      }
      console.log(returning, 'ok?');
      return returning;
    }
  };
  let friendslist = <></>;
  if (friendListArray !== null && friendListArray !== '' && friendListArray !== undefined) {
    if (friendListArray.length === 0) {
      friendslist = <></>;
    } else if (friendListArray.length <= 3) {
      friendslist = (
        <>
          <Row>
            <h6 style={{ color: textColor }}>Użytkownicy:</h6>
          </Row>
          <Row style={{ paddingLeft: 10 }}>
            <Space direction="vertical">
              {friendListArray.map((item) => (
                <>
                  <Space size={25} direction="horizontal">
                    <Text style={{ color: textColor }}>{searchName(item)}</Text>
                  </Space>
                </>
              ))}
            </Space>
          </Row>
        </>
      );
    } else if (friendListArray.length > 3) {
      friendslist = (
        <>
          <Button onClick={toggle} shape="round">
            Więcej
          </Button>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Użytkownicy:</ModalHeader>
            <ModalBody>
              <Space direction="vertical">
                {friendListArray.map((item) => (
                  <>
                    <Space size={25} direction="horizontal">
                      <Text style={{ color: textColor }}>{searchName(item)}</Text>
                    </Space>
                  </>
                ))}
              </Space>
            </ModalBody>
          </Modal>
        </>
      );
    }
  }
  return <>{friendslist}</>;
};

UsersInProjectList.propTypes = {
  project: PropTypes.object,
  mode: PropTypes.bool,
};

export default UsersInProjectList;
