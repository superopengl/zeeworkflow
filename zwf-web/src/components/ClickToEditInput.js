
import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledInput = styled(Input)`
border-radius: 4px;
width: 100%;

&:hover {
  border: 1px solid #0FBFC4AA;
  background-color: white;
}

&:focus, &:focus-within, &:active {
  border: 1px solid #0FBFC4;
  background-color: white;
}

&.error {
  border: 1px solid #cf222e;
  background-color: white;
}
`;

export const ClickToEditInput = React.memo((props) => {
  const { value: propValue, size, onChange, ...others } = props;

  const [value, setValue] = React.useState(propValue);
  const [focused, setFocused] = React.useState(false);
  const [className, setClassName] = React.useState(propValue ? '' : 'error');

  React.useEffect(() => {
    setValue(propValue);
  }, [propValue])

  const handleSave = (e) => {
    setFocused(false)
    const text = e.target.value?.trim();
    if (!text) {
      setClassName('error');
      return;
    }

    setClassName('');
    if (text !== propValue) {
      onChange(text);
    }
  }

  return <>
    <StyledInput
      {...others}
      className={className}
      value={value}
      onChange={e => setValue(e.target.value)}
      onFocus={() => setFocused(true)}
      bordered={false}
      allowClear={focused}
      onBlur={handleSave}
      style={{ fontSize: size -1  }}
    // onPressEnter={handleSave}
    />
  </>
});

ClickToEditInput.propTypes = {
  value: PropTypes.string,
  size: PropTypes.number,
  required: PropTypes.bool.isRequired,
};

ClickToEditInput.defaultProps = {
  value: '',
  size: 14,
  required: true
};
