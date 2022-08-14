import { useEffect, useState } from 'react'
import { Input, Button, Select, Table } from 'antd';
import styles from '../../../styles/Home.module.css'
import moment from 'moment'
import "antd/dist/antd.css";

const { Option } = Select;

const axios = require('axios').default;

const HomePage = () => {
  const [tableData, setTableData] = useState([])
  const [keyword, setKeyword] = useState()
  const [gender, setGender] = useState('all')

  useEffect(() => {
    axios.get('https://randomuser.me/api/', {
      params: {
        results: 20,
        ...(gender !== 'all' && { gender }),
      }
    }).then(response => {
      setTableData(response?.data?.results)
    })
  }, [gender])

  const columns = [
    {
      title: 'Username',
      dataIndex: 'login',
      key: 'login',
      render: (login) => login.username
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name) => `${name.first} ${name.last}` 
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
    },
    {
      title: 'Register Date',
      dataIndex: 'registered',
      key: 'registered',
      sorter: true,
      render: (registered) => moment(registered.date).format('DD:MM:YYYY hh:mm')
    },
  ];

  const handleSearch = () => {
    const currentData = [...tableData]
    const filteredData = currentData.filter(({ name }) => {
      const fullname = `${name.first} ${name.last}`.toLowerCase()
      return fullname.includes(keyword)
    })
    setTableData(filteredData)
  }

  const renderSearchBar = () => (
    <div className={styles.searchContainer}>
      <label>Search</label>
      <div className={styles.searchGroup}>
        <Input placeholder="Search" onChange={e => setKeyword(e.target.value)} />
        <Button onClick={handleSearch}>find</Button>
      </div>
    </div>  
  )

  const renderFilter = () => (
    <div className={styles.filterContainer}>
      <label>Gender</label>
      <div className={styles.filterGroup}>
        <Select defaultValue={gender} style={{ width: 120 }} onChange={setGender}>
          <Option value="all">All</Option>
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
        </Select>
        <Button onClick={() => setGender('all')}>reset filter</Button>
      </div>
    </div>  
  )
    console.log(tableData)
  return (
    <>
      <div className={styles.header}>
        {renderSearchBar()}
        {renderFilter()}
      </div>
      <div className={styles.content}>
        <Table
          dataSource={tableData.map(data => ({ ...data, key: data.email }))}
          columns={columns}
        />;
      </div>
    </>
  )
}

export default HomePage
