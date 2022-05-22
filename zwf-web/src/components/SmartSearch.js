import { AutoComplete, Typography, Space, Row, Col } from 'antd';
import React from 'react';
import { HighlightingText } from './HighlightingText';
import { ClientIcon, DocTemplateIcon, TaskIcon, TaskTemplateIcon } from './entityIcon';
import { EnterOutlined, SearchOutlined } from '@ant-design/icons';
import Tag from './Tag';
import { smartSearchTask$, smartSearchTaskTemplate$, smartSearchDocTemplate$, smartSearchClient$ } from 'services/smartSearchService';
import { UserNameCard } from './UserNameCard';
// import { useKey} from 'react-use';
import { useKeys } from "rooks";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

const DOMAIN_CONFIG = {
  'task': {
    searchHandler: smartSearchTask$,
    pathHandler: id => `/task/${id}`,
    renderHandler: (item, searchText) => <>
      <TaskIcon />
      <HighlightingText value={item.name} search={searchText} />
    </>,
    noFoundContent: <>No task is found.</>
  },
  'task_template': {
    searchHandler: smartSearchTaskTemplate$,
    pathHandler: id => `/task_template/${id}`,
    renderHandler: (item, searchText) => <>
      <TaskTemplateIcon />
      <HighlightingText value={item.name} search={searchText} />
    </>,
    noFoundContent: <>No task template is found.</>
  },
  'doc_template': {
    searchHandler: smartSearchDocTemplate$,
    pathHandler: id => `/doc_template/${id}`,
    renderHandler: (item, searchText) => <>
      <DocTemplateIcon />
      <HighlightingText value={item.name} search={searchText} />
    </>,
    noFoundContent: <>No doc template is found.</>
  },
  'client': {
    searchHandler: smartSearchClient$,
    pathHandler: id => `/client/${id}`,
    renderHandler: (item, searchText) => <UserNameCard userId={item.id} searchText={searchText} />,
    noFoundContent: <>No client is found.</>
  },
}

export const SmartSearch = React.memo((props) => {
  const [searchText, setSearchText] = React.useState();
  const [optionsWithinDomain, setOptionsWithinDomain] = React.useState([]);
  const [domain, setDomain] = React.useState();
  const [innerDropdownOpen, setInnerDropdownOpen] = React.useState(false);
  const [outerDropdownOpen, setOuterDropdownOpen] = React.useState(false);
  const innerRef = React.useRef();
  const outerRef = React.useRef();
  const navigate = useNavigate();

  const getOptions = React.useCallback(() => {
    const labels = [
      {
        key: 'task',
        label: 'tasks',
        icon: <TaskIcon />
      },
      {
        key: 'task_template',
        label: 'task templates',
        icon: <TaskTemplateIcon />
      },
      {
        key: 'doc_template',
        label: 'doc templates',
        icon: <DocTemplateIcon />
      },
      {
        key: 'client',
        label: 'clients',
        icon: <ClientIcon />
      }
    ];
    const options = labels.map(item => ({
      value: item.key,
      label: <Row gutter={10} justify="space-between" wrap={false}>
        <Col><SearchOutlined /> {item.icon}<Text ellipsis>{searchText}</Text></Col>
        <Col>
          <Tag>{item.label} <EnterOutlined /></Tag>
        </Col>
      </Row>
    }));

    return options;
  }, [searchText]);

  const handleSearch = text => {
    setSearchText(text);
  }

  React.useEffect(() => {
    if (!domain || !searchText?.trim()) {
      setOptionsWithinDomain(null)
      return;
    }

    const config = DOMAIN_CONFIG[domain];

    if (!config) {
      throw new Error(`Unsupported domain '${domain}'`)
    }

    config.searchHandler(searchText).subscribe(list => {
      const options = list.map(item => ({
        value: item.id,
        label: config.renderHandler(item, searchText)
      }));

      setOptionsWithinDomain(options);
      setInnerDropdownOpen(true);
    })
  }, [domain, searchText])

  const handleDomainSelected = (domain) => {
    setDomain(domain);
  }

  const handleSearchWithinDomain = () => {

  }

  const handleSelectWithinDomain = (id) => {
    const config = DOMAIN_CONFIG[domain];
    if (!config) {
      throw new Error(`Unsupported domain '${domain}'`)
    }

    const path = config.pathHandler(id);
    navigate(path);

    reset();
  }

  const reset = () => {
    setDomain(null);
    setSearchText('');
    setOptionsWithinDomain(null);
  }

  const handleValueChangeWithinDomain = value => {
    setSearchText(value);
    if (!value) {
      reset();
    }
  }

  useKeys(["Control", "KeyK"], ( )=> {
    setOuterDropdownOpen(true)
    outerRef.current.focus();
  })

  if (domain && searchText) {
    return <AutoComplete
      ref={innerRef}
      showSearch
      allowClear
      style={{ minWidth: 300, width: '100%' }}
      options={optionsWithinDomain}
      value={searchText}
      open={innerDropdownOpen}
      dropdownMatchSelectWidth={false}
      onFocus={() => setInnerDropdownOpen(true)}
      onBlur={() => setInnerDropdownOpen(false)}
      onChange={handleValueChangeWithinDomain}
      onSearch={handleSearchWithinDomain}
      onSelect={handleSelectWithinDomain}
      notFoundContent={DOMAIN_CONFIG[domain]?.noFoundContent}
    />
  }

  return <AutoComplete
      ref={outerRef}
      showSearch
      open={outerDropdownOpen}
      onFocus={() => setOuterDropdownOpen(true)}
      onBlur={() => setOuterDropdownOpen(false)}
      allowClear
      placeholder="Search ... (CTRL + K)"
      style={{ minWidth: 300, width: '100%' }}
      options={getOptions()}
      dropdownMatchSelectWidth={false}
      onSearch={handleSearch}
      onSelect={handleDomainSelected}
    />
});

SmartSearch.propTypes = {
};

SmartSearch.defaultProps = {
};

