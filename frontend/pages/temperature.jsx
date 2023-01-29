import { Button, Heading, Box, Spinner, Center, Text, Input } from "@chakra-ui/react"
import { CheckIcon, CloseIcon, SmallAddIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import Layout from "../layout/layout"
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
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
    y1: {
      type: 'linear',
      display: true,
      position: 'left',
      suggestedMin: 12,
      suggestedMax: 18,
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
    },
  },
};


const Temperature = () => {
  const [temp_and_humid, setTempAndHumid] = useState({datasets:[]})
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/reading/');
    let data = await res.json()
    setLocation(data.location)

    setTempAndHumid({
      labels: data.dates,
      datasets: [
        {
          label: "Temperatures",
          fill: false,
          // backgroundColor: colors.green.fill,
          // pointBackgroundColor: colors.green.stroke,
          borderColor: 'rgb(255, 99, 132)',
          label: 'Temperature',
          data: data.temperatures,
          yAxisID: 'y1'
        },{
          label: "Humidity",
          fill: false,
          // backgroundColor: colors.green.fill,
          // pointBackgroundColor: colors.green.stroke,
          borderColor: 'rgb(53, 162, 235)',
          label: 'Humidity',
          data: data.humidities,
          yAxisID: 'y2'
        },
      ],
    })
    setLoading(false)
  }

  useEffect(() => {
   fetchData() 
  }, [])

  return (
    <Layout metas={{title: "House Readings"}}>
      <Box w='xl' maxW={'100%'} my={5} p={2}>
        <Heading>Temperature Readings</Heading>
        <Text>Temperature and humidity readings taken at 1 minute resolution</Text>
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
      </Box>
    </Layout>
  )
}

export default Temperature;