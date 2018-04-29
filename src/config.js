module.exports = {
  encoding: 'utf8',
  gistApi: username => `https://api.github.com/users/${username}/gists`,
  isNotStringError: 'Inputs must be of type string!',
  isUndefinedError: (key) => `${key} is undefined!`,
  noDescriptionError: description => `No gist described as "${description}" found!`,
};
