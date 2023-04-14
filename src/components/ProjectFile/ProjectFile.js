import React, { useState } from 'react';
import { Upload, Button, Card, Row } from 'antd';
import PropTypes from 'prop-types';
import ReactDiffViewer from 'react-diff-viewer';
import { UploadOutlined } from '@ant-design/icons';

const ProjectFile = ({ project = [] }) => {
  const [oldfileText, setOldText] = useState(project.file);
  const [newfileText, setFileText] = useState(project.newfile);
  console.log(oldfileText === '', newfileText === '');
  const saveFile = (event) => {
    setOldText(newfileText);
    setFileText(event);
    fetch('http://localhost:3000/updatefile', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: project.name,
        newfile: event,
        file: newfileText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 'fail') {
          console.log('błędny login lub hasło');
        }
      });
  };
  let diffViever = <></>;
  if (oldfileText !== null && newfileText !== null) {
    diffViever = <ReactDiffViewer oldValue={oldfileText} newValue={newfileText} splitView />;
  }
  let output = <></>;
  if (project.file === '') {
    output = (
      <>
        <Upload
          accept=".txt, .js, .css"
          showUploadList={false}
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              console.log(e.target.result);
              saveFile(e.target.result);
            };
            reader.readAsText(file);

            // Prevent upload
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </>
    );
  }
  if (project.file !== '') {
    output = (
      <>
        <Row>
          <Upload
            accept=".txt, .js"
            showUploadList={false}
            beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                saveFile(e.target.result);
              };
              reader.readAsText(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Row>
        <Row>{diffViever}</Row>
      </>
    );
  }
  return <Card>{output}</Card>;
};

ProjectFile.propTypes = {
  project: PropTypes.object,
};

export default ProjectFile;
