import { Heading, Box, Spinner, Center, Text, Select } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'House Temperature and Humidity',
    },
  },
  scales: {
    x: {
      type: 'time',
    },

    y1: {
      type: 'linear',
      display: true,
      position: 'left',
      suggestedMin: 12,
      suggestedMax: 18,
      ticks: {
        callback: function(value, index, ticks) {
            return value + "°C";
        }
      }
    },

    y2: {
      type: 'linear',
      display: true,
      suggestedMin: 60,
      suggestedMax: 70,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        callback: function(value, index, ticks) {
            return value + "%";
        }
      }
    },
  },
  elements:{
    point:{
        borderWidth: 0,
        radius: 10,
        backgroundColor: 'rgba(0,0,0,0)'
    }
  }
};


const Temperature = () => {
  const [temp_and_humid, setTempAndHumid] = useState({datasets:[]})
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(true)
  const [hours, setHours] = useState(24)
  const [currentTemp, setCurrentTemp] = useState(0)

  const fetchData = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/reading/' + String(hours));
    let data = await res.json()
    setLocation(data.location)
    setCurrentTemp(data.temperatures[data.temperatures.length - 1])

    setTempAndHumid({
      labels: data.dates,
      datasets: [
        {
          label: "Temperature",
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 0,
          label: 'Temperature',
          data: data.temperatures,
          yAxisID: 'y1',
          tension: 0.2
        },{
          label: "Humidity",
          fill: false,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgb(53, 162, 235)',
          pointRadius: 0,
          label: 'Humidity',
          data: data.humidities,
          yAxisID: 'y2',
          tension: 0.2
        },
      ],
    })
    setLoading(false)
  }

  useEffect(() => {
   fetchData() 
  }, [hours])


  return (
    <Layout metas={{title: "House Readings"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
        <Heading>Temperature Readings</Heading>
        <Text>Temperature and humidity readings taken at 1 minute resolution</Text>
        <Select placeholder='Select Time' value={hours} bg={'white'} my={5} onChange={(e) => setHours(e.target.value)}>
          <option value={24}>24 Hours</option>
          <option value={48}>48 Hours</option>
          <option value={168}>Last week</option>
        </Select>
        {loading ? 
          <Center>
            <Spinner m={6} size='lg'/>
          </Center>
          :
          <>
          <Heading>It's {currentTemp}°C</Heading>
          <Text>Locations: {location}</Text>
          <Box bg='white' p={4} borderRadius={'lg'} h={'70vh'} mt={3}>
          <Line
            options={options}
            data={temp_and_humid}
            redraw={true}
            updateMode={'resize'}
            // {...props}
            />
        </Box>
            </>
          }
      </Box>
    </Layout>
  )
}

export default Temperature;