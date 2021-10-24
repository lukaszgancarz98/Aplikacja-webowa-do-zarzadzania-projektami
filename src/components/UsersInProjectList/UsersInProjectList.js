import React, { useEffect, useState } from 'react';
import { Row, Space, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

const { Text } = Typography;

const UsersInProjectList = ({ project = [] }) => {
  const [users, setUsers] = useState();
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal((previous) => !previous);
  };
  let friendListArray;
  if (project.users) {
    friendListArray = project.users.split(',').filter((item) => item !== '');
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
        returning = find.user;
      } else {
        returning = '';
      }
      return returning;
    }
  };
  let friendslist = <></>;
  if (friendListArray !== null && friendListArray !== '' && friendListArray !== undefined) {
    if (friendListArray.length <= 3) {
      friendslist = (
        <>
          <Row>
            <h6>Użytkownicy:</h6>
          </Row>
          <Row>
            <Space direction="vertical">
              {friendListArray.map((item) => (
                <>
                  <Space size={25} direction="horizontal">
                    <Text>{searchName(item)}</Text>
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
            Show ppl
          </Button>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Użytkownicy:</ModalHeader>
            <ModalBody>
              <Space direction="vertical">
                {friendListArray.map((item) => (
                  <>
                    <Space size={25} direction="horizontal">
                      <Text>{searchName(item)}</Text>
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
};

export default UsersInProjectList;
