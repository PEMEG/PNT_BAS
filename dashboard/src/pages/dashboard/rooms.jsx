import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import Moment from 'moment'
import { Select } from 'antd'
import toast from 'react-hot-toast'

export function Rooms() {
  const [rooms, setRooms] = useState({})
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
        toast.success('Pomieszczenie zapisane')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Nie udało się zapisać pomieszczenia')
      })
  }

  const onSearch = (value) => {
    console.log('search:', value)
  }

  const getMonthColumns = () => {
    let arr = []
    rooms.map((room) =>
      room.meterReadings.map((reading) => {
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
    axios
      .get(`http://localhost:8000/api/rooms`)
      .then((res) => {
        setRooms(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        console.error(error)
        toast.error('Nie udało się pobrać listy pomieszczeń')
      })

    axios
      .get(`http://localhost:8000/api/companies`)
      .then((res) => {
        setCompanies(res.data)
        console.log(res.data)
      })
      .catch((error) => {
        console.error(error)
        toast.error('Nie udało się pobrać listy firm')
      })
  }, [])

  useEffect(() => {
    if (Object.keys(rooms).length === 0) return
    if (Object.keys(companies).length === 0) return
    setLoading(false)
    console.log(getMonthColumns())
  }, [rooms, companies])

  if (!loading) {
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Lista pomieszczeń
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {['Pomieszczenie', 'firma'].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 px-5 py-3 text-left"
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
                            className="min-w-[8rem]"
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
      </div>
    )
  }
}

export default Rooms
