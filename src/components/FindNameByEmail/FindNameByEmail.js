import PropTypes from 'prop-types';

const FindNameByEmail = ({ users = [], email }) => {
  console.log(users, email);
  const nameFound = users.find((user) => user.email === email);
  return nameFound.user;
};

FindNameByEmail.propTypes = {
  email: PropTypes.string,
  users: PropTypes.object,
};

export default FindNameByEmail;
