import React, { useState, useMemo } from 'react';
import { 
  Layout, 
  Card, 
  Select, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Space,
  Divider,
  Badge,
  Avatar,
  Tooltip,
  DatePicker,
  Collapse,
  Input,
  message,
  Modal
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  CoffeeOutlined,
  HomeOutlined,
  ShoppingOutlined,
  StarOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { facilities, employees, initialSchedule } from '../data/mockData';
import { Facility, Employee, ShiftSchedule } from '../types';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { Search } = Input;

const FacilitySchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ShiftSchedule>(initialSchedule);
  const [selectedWeek, setSelectedWeek] = useState(dayjs());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKeys, setActiveKeys] = useState<string[]>(['Kitchen', 'Service', 'Administration', 'Bar']);

  const getDepartmentIcon = (type: string) => {
    switch (type) {
      case 'kitchen': return <CoffeeOutlined />;
      case 'service': return <TeamOutlined />;
      case 'admin': return <SettingOutlined />;
      case 'bar': return <StarOutlined />;
      default: return <HomeOutlined />;
    }
  };

  const getDepartmentColor = (type: string) => {
    switch (type) {
      case 'kitchen': return '#52c41a';
      case 'service': return '#1890ff';
      case 'admin': return '#fa8c16';
      case 'bar': return '#eb2f96';
      default: return '#722ed1';
    }
  };

  const getWeekDays = () => {
    const startOfWeek = selectedWeek.startOf('week');
    return Array.from({ length: 7 }, (_, i) => 
      startOfWeek.add(i, 'day')
    );
  };

  const getEmployeesByDepartment = (department: string) => {
    return employees.filter(emp => emp.department === department);
  };

  const updateSchedule = (
    facilityId: string, 
    date: string, 
    shift: 'morning' | 'evening', 
    employeeId: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [facilityId]: {
          ...prev[date]?.[facilityId],
          [shift]: employeeId
        }
      }
    }));
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || 'Unassigned';
  };

  // Auto Schedule Algorithm
  const autoSchedule = () => {
    Modal.confirm({
      title: 'Auto Schedule Confirmation',
      icon: <ExclamationCircleOutlined />,
      content: 'This will automatically assign employees to all facilities for the selected week. Existing assignments will be overwritten. Continue?',
      okText: 'Yes, Auto Schedule',
      cancelText: 'Cancel',
      onOk: () => {
        const weekDays = getWeekDays();
        const newSchedule = { ...schedule };
        
        // Track employee assignments to avoid conflicts
        const employeeAssignments: { [date: string]: { [employeeId: string]: string[] } } = {};
        
        weekDays.forEach(day => {
          const dateStr = day.format('YYYY-MM-DD');
          employeeAssignments[dateStr] = {};
          
          // Initialize employee tracking for this date
          employees.forEach(emp => {
            employeeAssignments[dateStr][emp.id] = [];
          });
          
          if (!newSchedule[dateStr]) {
            newSchedule[dateStr] = {};
          }
        });

        // Smart assignment algorithm
        facilities.forEach(facility => {
          const departmentEmployees = getEmployeesByDepartment(facility.department);
          
          weekDays.forEach(day => {
            const dateStr = day.format('YYYY-MM-DD');
            
            if (!newSchedule[dateStr][facility.id]) {
              newSchedule[dateStr][facility.id] = {};
            }

            // Assign morning shift
            const availableMorningEmployees = departmentEmployees.filter(emp => 
              !employeeAssignments[dateStr][emp.id].includes('morning')
            );
            
            if (availableMorningEmployees.length > 0) {
              const randomMorningEmployee = availableMorningEmployees[
                Math.floor(Math.random() * availableMorningEmployees.length)
              ];
              newSchedule[dateStr][facility.id].morning = randomMorningEmployee.id;
              employeeAssignments[dateStr][randomMorningEmployee.id].push('morning');
            }

            // Assign evening shift (different employee if possible)
            const availableEveningEmployees = departmentEmployees.filter(emp => 
              !employeeAssignments[dateStr][emp.id].includes('evening') &&
              emp.id !== newSchedule[dateStr][facility.id].morning
            );
            
            if (availableEveningEmployees.length > 0) {
              const randomEveningEmployee = availableEveningEmployees[
                Math.floor(Math.random() * availableEveningEmployees.length)
              ];
              newSchedule[dateStr][facility.id].evening = randomEveningEmployee.id;
              employeeAssignments[dateStr][randomEveningEmployee.id].push('evening');
            } else if (departmentEmployees.length > 0) {
              // Fallback: assign any available employee from department
              const fallbackEmployee = departmentEmployees[
                Math.floor(Math.random() * departmentEmployees.length)
              ];
              newSchedule[dateStr][facility.id].evening = fallbackEmployee.id;
            }
          });
        });

        setSchedule(newSchedule);
        message.success('Auto-scheduling completed successfully!');
      }
    });
  };

  // Filter facilities based on search term
  const filteredFacilities = useMemo(() => {
    if (!searchTerm) return facilities;
    
    return facilities.filter(facility =>
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const groupedFacilities = filteredFacilities.reduce((acc, facility) => {
    if (!acc[facility.department]) {
      acc[facility.department] = [];
    }
    acc[facility.department].push(facility);
    return acc;
  }, {} as Record<string, Facility[]>);

  const weekDays = getWeekDays();

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* Header Section */}
        <Card 
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space align="center" style={{ marginBottom: { xs: '16px', md: '0' } }}>
                <Avatar 
                  size={40} 
                  style={{ background: '#1890ff' }}
                  icon={<CalendarOutlined />}
                />
                <div>
                  <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    Facility Schedule
                  </Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    {selectedWeek.format('MMMM YYYY')} • Week {selectedWeek.week()}
                  </Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={[12, 12]} justify="end">
                <Col xs={24} sm={12} md={8}>
                  <DatePicker.WeekPicker
                    value={selectedWeek}
                    onChange={(date) => setSelectedWeek(date || dayjs())}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <Button 
                    type="primary" 
                    icon={<ThunderboltOutlined />}
                    style={{ borderRadius: '8px', width: '100%' }}
                    onClick={autoSchedule}
                  >
                    Auto Schedule
                  </Button>
                </Col>
                <Col xs={12} sm={6} md={4}>
                  <Button 
                    icon={<TeamOutlined />}
                    style={{ borderRadius: '8px', width: '100%' }}
                  >
                    Report
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* Search Section */}
        <Card 
          style={{ 
            marginBottom: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          bodyStyle={{ padding: '16px 24px' }}
        >
          <Search
            placeholder="Search facilities by name or department..."
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </Card>

        {/* Schedule Grid */}
        <Card 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          bodyStyle={{ padding: '0' }}
        >
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '1200px' }}>
              {/* Header Row */}
              <div style={{ 
                display: 'flex', 
                background: '#fafafa', 
                borderBottom: '1px solid #e8e8e8',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                <div style={{ 
                  width: '300px', 
                  padding: '16px 24px',
                  borderRight: '1px solid #e8e8e8',
                  background: '#fff',
                  position: 'sticky',
                  left: 0,
                  zIndex: 11
                }}>
                  <Text strong style={{ fontSize: '16px' }}>Facility</Text>
                </div>
                {weekDays.map(day => (
                  <div 
                    key={day.format('YYYY-MM-DD')} 
                    style={{ 
                      width: '160px', 
                      padding: '16px 12px',
                      textAlign: 'center',
                      borderRight: '1px solid #e8e8e8'
                    }}
                  >
                    <Text strong style={{ fontSize: '14px', color: '#1890ff' }}>
                      {day.format('ddd')}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '12px', color: '#666' }}>
                      {day.format('MM/DD')}
                    </Text>
                  </div>
                ))}
              </div>

              {/* Facilities Accordion */}
              <Collapse 
                activeKey={activeKeys}
                onChange={setActiveKeys}
                ghost
                expandIconPosition="end"
              >
                {Object.entries(groupedFacilities).map(([department, facilityList]) => (
                  <Panel 
                    header={
                      <div style={{ 
                        padding: '12px 24px',
                        borderRight: '1px solid #e8e8e8',
                        background: '#fff',
                        position: 'sticky',
                        left: 0,
                        zIndex: 10,
                        width: '300px',
                        marginLeft: '-24px'
                      }}>
                        <Space>
                          <span style={{ color: getDepartmentColor(facilityList[0].type) }}>
                            {getDepartmentIcon(facilityList[0].type)}
                          </span>
                          <Text strong style={{ fontSize: '16px' }}>{department}</Text>
                          <Badge 
                            count={facilityList.length} 
                            style={{ 
                              backgroundColor: getDepartmentColor(facilityList[0].type),
                              boxShadow: 'none'
                            }}
                          />
                        </Space>
                      </div>
                    }
                    key={department}
                    style={{ border: 'none' }}
                  >
                    {facilityList.map(facility => (
                      <div 
                        key={facility.id}
                        style={{ 
                          display: 'flex',
                          borderBottom: '1px solid #f0f0f0',
                          background: `${getDepartmentColor(facility.type)}02`
                        }}
                      >
                        {/* Sticky Facility Info */}
                        <div style={{ 
                          width: '300px',
                          padding: '16px 24px',
                          borderRight: '1px solid #e8e8e8',
                          background: '#fff',
                          position: 'sticky',
                          left: 0,
                          zIndex: 9
                        }}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong style={{ fontSize: '14px' }}>{facility.name}</Text>
                            <Space>
                              <Badge 
                                count={`Cap: ${facility.capacity}`} 
                                style={{ 
                                  backgroundColor: '#f0f0f0',
                                  color: '#666',
                                  fontSize: '11px'
                                }}
                              />
                              <Badge 
                                count={facility.department} 
                                style={{ 
                                  backgroundColor: getDepartmentColor(facility.type),
                                  fontSize: '11px'
                                }}
                              />
                            </Space>
                          </Space>
                        </div>
                        
                        {/* Scrollable Schedule Cells */}
                        {weekDays.map(day => {
                          const dateStr = day.format('YYYY-MM-DD');
                          const facilitySchedule = schedule[dateStr]?.[facility.id];
                          
                          return (
                            <div 
                              key={dateStr}
                              style={{ 
                                width: '160px',
                                padding: '12px',
                                borderRight: '1px solid #e8e8e8'
                              }}
                            >
                              <Space direction="vertical" style={{ width: '100%' }}>
                                {/* Morning Shift */}
                                <Tooltip title="Morning Shift (9:00 AM - 5:00 PM)">
                                  <Select
                                    placeholder="Morning"
                                    value={facilitySchedule?.morning}
                                    onChange={(value) => updateSchedule(facility.id, dateStr, 'morning', value)}
                                    style={{ width: '100%' }}
                                    size="small"
                                    allowClear
                                  >
                                    {getEmployeesByDepartment(facility.department).map(emp => (
                                      <Option key={emp.id} value={emp.id}>
                                        <Space>
                                          <Avatar size={16} icon={<UserOutlined />} />
                                          <Text style={{ fontSize: '12px' }}>{emp.name}</Text>
                                        </Space>
                                      </Option>
                                    ))}
                                  </Select>
                                </Tooltip>
                                
                                {/* Evening Shift */}
                                <Tooltip title="Evening Shift (5:00 PM - 12:00 AM)">
                                  <Select
                                    placeholder="Evening"
                                    value={facilitySchedule?.evening}
                                    onChange={(value) => updateSchedule(facility.id, dateStr, 'evening', value)}
                                    style={{ width: '100%' }}
                                    size="small"
                                    allowClear
                                  >
                                    {getEmployeesByDepartment(facility.department).map(emp => (
                                      <Option key={emp.id} value={emp.id}>
                                        <Space>
                                          <Avatar size={16} icon={<UserOutlined />} />
                                          <Text style={{ fontSize: '12px' }}>{emp.name}</Text>
                                        </Space>
                                      </Option>
                                    ))}
                                  </Select>
                                </Tooltip>
                              </Space>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </Panel>
                ))}
              </Collapse>
            </div>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default FacilitySchedule;