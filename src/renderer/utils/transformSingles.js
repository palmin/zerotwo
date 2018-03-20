import _ from 'lodash';

export default data => _.transform(data, (result, value, key) => {
  if (_.isArray(value) && value.length === 1) {
    result[key] = _.join(value);
  }
}, {});
