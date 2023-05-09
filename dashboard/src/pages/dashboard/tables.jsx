import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from '@material-tailwind/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { authorsTableData, projectsTableData } from '@/data'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import Moment from 'moment'
import { Select } from 'antd'

export function Tables() {
  const [rooms, setRooms] = useState({})
  // const [readings, setReadings] = useState({})
  const [companies, setCompanies] = useState({})
  const [loading, setLoading] = useState(true)

  const onChange = (value) => {
    const room = JSON.parse(value)
    console.log(`selected ${value}`)
    axios
      .put(`http://localhost:8000/api/rooms/${room?.id}`, {
        name: room?.name,
        company_id: room?.company_id,
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((error) => console.error(error))
  }

  const onSearch = (value) => {
    console.log('search:', value)
  }

  const getMonthColumns = () => {
    let arr = []
    rooms.map((room) =>
      room.meter_readings.map((reading) => {
        let found = false
        arr.find((value) => {
          if (value.valueOf() == reading.month.valueOf()) found = true
        })
        if (!found) arr = [...arr, reading.month]
      })
    )
    return arr
  }

  const formatArray = (array, dateFormat) => {
    let arr = []
    array.map((element) => {
      arr = [...arr, Moment(element).format(dateFormat)]
    })
    return arr
  }

  useEffect(() => {
    // axios
    //   .get(`http://localhost:8000/api/meter_readings`)
    //   .then((res) => {
    //     setReadings(res.data)
    //     console.log(res.data)
    //   })
    //   .catch((error) => console.error(error))

    axios
      .get(`http://localhost:8000/api/rooms`)
      .then((res) => {
        setRooms(res.data)
        console.log(res.data)
      })
      .catch((error) => console.error(error))

    axios
      .get(`http://localhost:8000/api/companies`)
      .then((res) => {
        setCompanies(res.data)
        console.log(res.data)
      })
      .catch((error) => console.error(error))
  }, [])

  useEffect(() => {
    // if (Object.keys(readings).length === 0) return
    if (Object.keys(rooms).length === 0) return
    if (Object.keys(companies).length === 0) return
    setLoading(false)
    console.log(getMonthColumns())
  }, [rooms, companies])

  if (!loading) {
    return (
      <div className="flex flex-col gap-12 mt-12 mb-8">
        {/* <Card>
          <CardHeader variant="gradient" color="blue" className="p-6 mb-8">
            <Typography variant="h6" color="white">
              Lista odczytów
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {['Pomieszczenie', 'firma', 'miesiąc', 'odczyt'].map((el) => (
                    <th
                      key={el}
                      className="px-5 py-3 text-left border-b border-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {readings.map(({ id, room, month, state }, key) => {
                  const className = `py-3 px-5 ${
                    key === readings.length - 1
                      ? ''
                      : 'border-b border-blue-gray-50'
                  }`

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {room?.name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'INKUBATOR'}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {room?.company?.name ?? '-'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {Moment(month).format('MM/YYYY') ?? '-'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {state ?? '-'}
                        </Typography>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardBody>
        </Card> */}

        <Card>
          <CardHeader variant="gradient" color="blue" className="p-6 mb-8">
            <Typography variant="h6" color="white">
              Lista odczytów
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    'Pomieszczenie',
                    'firma',
                    ...formatArray(getMonthColumns(), 'MM/YYYY'),
                  ].map((column) => (
                    <th
                      key={column}
                      className="px-5 py-3 text-left border-b border-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {column}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, key) => {
                  const className = `py-3 px-5 ${
                    key === rooms.length - 1
                      ? ''
                      : 'border-b border-blue-gray-50'
                  }`

                  return (
                    <tr key={room?.name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {room?.name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'INKUBATOR'}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {room?.company?.name ?? '-'}
                        </Typography>
                      </td>
                      {room?.meter_readings?.map((reading) => (
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {reading.state}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {'kW/h'}
                          </Typography>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader variant="gradient" color="blue" className="p-6 mb-8">
            <Typography variant="h6" color="white">
              Lista pomieszczeń
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {['Pomieszczenie', 'firma'].map((el) => (
                    <th
                      key={el}
                      className="px-5 py-3 text-left border-b border-blue-gray-50"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map(({ id, name, company }, key) => {
                  const className = `py-3 px-5 ${
                    key === rooms.length - 1
                      ? ''
                      : 'border-b border-blue-gray-50'
                  }`

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {'INKUBATOR'}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          <Select
                            key={id}
                            showSearch
                            // allowClear
                            defaultValue={company?.name ?? null}
                            placeholder="Wybierz firmę"
                            optionFilterProp="children"
                            onChange={onChange}
                            onSearch={onSearch}
                            filterOption={(input, option) =>
                              (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            options={[
                              {
                                value: JSON.stringify({
                                  id: id,
                                  name: name,
                                  company_id: null,
                                }),
                                label: '---',
                              },
                              ...companies?.map((company) => {
                                return {
                                  value: JSON.stringify({
                                    id: id,
                                    name: name,
                                    company_id: company?.id || null,
                                  }),
                                  label: company.name,
                                }
                              }),
                            ]}
                          />
                        </Typography>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* <Card>
          <CardHeader variant="gradient" color="blue" className="p-6 mb-8">
            <Typography variant="h6" color="white">
              Authors Table
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {['author', 'function', 'status', 'employed', ''].map(
                    (el) => (
                      <th
                        key={el}
                        className="px-5 py-3 text-left border-b border-blue-gray-50"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {authorsTableData.map(
                  ({ img, name, email, job, online, date }, key) => {
                    const className = `py-3 px-5 ${
                      key === authorsTableData.length - 1
                        ? ''
                        : 'border-b border-blue-gray-50'
                    }`

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold"
                              >
                                {name}
                              </Typography>
                              <Typography className="text-xs font-normal text-blue-gray-500">
                                {email}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {job[0]}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {job[1]}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={online ? 'green' : 'blue-gray'}
                            value={online ? 'online' : 'offline'}
                            className="py-0.5 px-2 text-[11px] font-medium"
                          />
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {date}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            Edit
                          </Typography>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card>
          <CardHeader variant="gradient" color="blue" className="p-6 mb-8">
            <Typography variant="h6" color="white">
              Projects Table
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2 overflow-x-scroll">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {['companies', 'members', 'budget', 'completion', ''].map(
                    (el) => (
                      <th
                        key={el}
                        className="px-5 py-3 text-left border-b border-blue-gray-50"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-bold uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ''
                        : 'border-b border-blue-gray-50'
                    }`

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? '' : '-ml-2.5'
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="block mb-1 text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>
                            <Progress
                              value={completion}
                              variant="gradient"
                              color={completion === 100 ? 'green' : 'blue'}
                              className="h-1"
                            />
                          </div>
                        </td>
                        <td className={className}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            <EllipsisVerticalIcon
                              strokeWidth={2}
                              className="w-5 h-5 text-inherit"
                            />
                          </Typography>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card> */}
      </div>
    )
  }
}

export default Tables
