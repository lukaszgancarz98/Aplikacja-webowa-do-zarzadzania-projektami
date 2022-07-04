import React from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

const LastTimeUpdateDisplay = ({ update, mode }) => {
  let updateDisplay = <></>;
  const textColor = mode ? 'white' : 'black';
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
  return <p style={{ color: textColor }}>{updateDisplay}</p>;
};

LastTimeUpdateDisplay.propTypes = {
  update: PropTypes.string,
  mode: PropTypes.bool,
};

export default LastTimeUpdateDisplay;
