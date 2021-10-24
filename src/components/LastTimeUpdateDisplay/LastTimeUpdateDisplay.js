import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const LastTimeUpdateDisplay = ({ update }) => {
  let updateDisplay = <></>;
  if (update !== undefined && update !== null) {
    updateDisplay = (
      <>
        <Col>
          <Row>Ostatnia aktualizacja: </Row>
          <Row>{moment(new Date(update)).format('DD.MM HH:mm')}</Row>
        </Col>
      </>
    );
  }
  return <>{updateDisplay}</>;
};

LastTimeUpdateDisplay.propTypes = {
  update: PropTypes.string,
};

export default LastTimeUpdateDisplay;
