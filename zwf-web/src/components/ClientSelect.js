import PropTypes from 'prop-types';
import React from 'react';
import { searchOrgClientUsers$ } from 'services/userService';
import { UserSelect } from './UserSelect';
import { useDebounce } from "rooks";

export const ClientSelect = React.memo((props) => {
  const { value, valueProp, onChange, allowInput } = props;
  const [dataSource, setDataSource] = React.useState([]);

  React.useEffect(() => {
    load$();
  }, [])

  const load$ = (text) => {
    searchOrgClientUsers$({ text }).subscribe(resp => {
      setDataSource(resp.data)
    })
  }

  const handleTextChange = useDebounce(text => {
    if(valueProp === 'email') {
      load$(text);
    }
  }, 500);

  return <UserSelect
    value={value}
    dataSource={dataSource}
    allowInput={allowInput}
    valueProp={valueProp}
    onChange={onChange}
    onTextChange={handleTextChange}
    placeholder={allowInput ? 'Search a client by name or email or input a new email address' : 'Select a client by name or email'}
  />
});

ClientSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  valueProp: PropTypes.oneOf(['id', 'email']),
  allowInput: PropTypes.bool,
};

ClientSelect.defaultProps = {
  valueProp: 'id',
  allowInput: true,
};

