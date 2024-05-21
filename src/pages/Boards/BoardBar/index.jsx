import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Button from '@mui/material/Button'
import { Tooltip } from '@mui/material'

function BoardBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        borderBottom: '1px solid #00bfa5',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        px: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          icon={<DashboardIcon fontSize='small'/>}
          label="Toan Toan MERN Stack Board"
          clickable
          sx={{
            borderRadius: '4px',
            color: 'white',
            border: 'none',
            backgroundColor: 'transparent',
            paddingX: '5px',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        />
        <Chip
          icon={<VpnLockIcon fontSize='small'/>}
          label="Public/Private Workspace"
          clickable
          sx={{
            borderRadius: '4px',
            color: 'white',
            border: 'none',
            backgroundColor: 'transparent',
            paddingX: '5px',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        />
        <Chip
          icon={<AddToDriveIcon fontSize='small'/>}
          label="Add To Google Drive"
          clickable
          sx={{
            borderRadius: '4px',
            color: 'white',
            border: 'none',
            backgroundColor: 'transparent',
            paddingX: '5px',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        />
        <Chip
          icon={<BoltIcon fontSize='small'/>}
          label="Automation"
          clickable
          sx={{
            borderRadius: '4px',
            color: 'white',
            border: 'none',
            backgroundColor: 'transparent',
            paddingX: '5px',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        />
        <Chip
          icon={<FilterListIcon fontSize='small'/>}
          label="Filters"
          clickable
          sx={{
            borderRadius: '4px',
            color: 'white',
            border: 'none',
            backgroundColor: 'transparent',
            paddingX: '5px',
            '& .MuiSvgIcon-root': {
              color: 'white'
            },
            '&:hover': {
              bgcolor: 'primary.50'
            }
          }}
        />
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        '& .MuiAvatar-root': {
          width: 30,
          height: 30
        }
      }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
            Invite
        </Button>

        <AvatarGroup
          max={6}
          sx={{
            gap: '10px',
            '.MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none'
            }
          }}
        >
          <Tooltip sx={{ cursor: 'pointer' }} title="Toàn Nguyễn">
            <Avatar alt="Remy Sharp" src="https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-6/426531945_2651467745014509_5145933200490941750_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGVJEqivR_4uHqzttD8IQqYF7KNG-hknsAXso0b6GSewJFJ9jWmgGiijU5Sfokl-YomeKhcQtD0pPyIcRbPXfUF&_nc_ohc=Mg1kdo6LkqwQ7kNvgHxkRIB&_nc_ht=scontent.fsgn5-5.fna&oh=00_AYDO7ktqXRmxK7sznic1tqmFdbC31tJwfjgbf3ZH_wkDDQ&oe=66478DAC" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Thao Nguyen">
            <Avatar alt="Travis Howard" src="https://scontent.fsgn5-11.fna.fbcdn.net/v/t39.30808-1/428610107_1443710099601340_6394817889676032439_n.jpg?stp=cp6_dst-jpg_p320x320&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEPHXxx9FDViWROwGqFPK3vhtRT2rp0rS6G1FPaunStLi47S5t87ISadTZX-gYgQgdgNhaaKgcbsqMqcA_h7u4n&_nc_ohc=nixKbbuWJRYQ7kNvgH8BZHD&_nc_ht=scontent.fsgn5-11.fna&oh=00_AYDIm8i7af_GwgBIKuig5E7NXbamZuA54dq8aLkt0D09YQ&oe=6647A0AD" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Hóng hớt sâu bít">
            <Avatar alt="Hóng hớt sâu bít" src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/440478253_458735029940652_4820725633464943323_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGsdSHZ1e1mS-fC1Y3uI-X5rrdMpwrrpraut0ynCuumtq6YDJl4rY4WCQrwZqpT3JvSkw2E-1cWM2UFz66yaypb&_nc_ohc=OxY5igHzDIcQ7kNvgFs2uqU&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYD6bAhwkd14-ybmb9fa7MdZBTxLko1F7FIl7_s7iyXr9w&oe=66478F3E" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Lưu Như">
            <Avatar alt="Lưu Như" src="https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-1/420854488_1801324463641263_3319990192458471041_n.jpg?stp=dst-jpg_p480x480&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFu9VxrNUv2QO5EopiqIkThKPweoiRDHkko_B6iJEMeSXGUZsf12m2SqTjcXAezeu5BJm2wU6O9EIXsRMBHUuP6&_nc_ohc=J41MAbCvk9QQ7kNvgGAHl3-&_nc_ht=scontent.fsgn5-12.fna&oh=00_AYAwnWTS2FmjAPzCDb5KEn4JZsqp62DQT4zB-wReetXrSg&oe=6647A35D" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="About Noo Noo">
            <Avatar alt="Trevor Henderson" src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/414876617_917817016369975_2165741091627091488_n.jpg?stp=c0.0.480.480a_dst-jpg_p480x480&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeG8imyYrHCUqF5ake1tKTRRMrFqPMEkK9MysWo8wSQr080S1jCg9Qi4KV8VmOVUrYCO93pjfSdUjNSw-fUJ0u3_&_nc_ohc=2roiJZxvm9UQ7kNvgHYbKTZ&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYC-uwHmXJMEFyb8VXjDiW_4IWUCv8lWfm7SiJ3wRQq4vA&oe=6647A919" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Trevor Henderson">
            <Avatar alt="Trevor Henderson" src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/414876617_917817016369975_2165741091627091488_n.jpg?stp=c0.0.480.480a_dst-jpg_p480x480&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeG8imyYrHCUqF5ake1tKTRRMrFqPMEkK9MysWo8wSQr080S1jCg9Qi4KV8VmOVUrYCO93pjfSdUjNSw-fUJ0u3_&_nc_ohc=2roiJZxvm9UQ7kNvgHYbKTZ&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYC-uwHmXJMEFyb8VXjDiW_4IWUCv8lWfm7SiJ3wRQq4vA&oe=6647A919" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Trevor Henderson">
            <Avatar alt="Trevor Henderson" src="https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/414876617_917817016369975_2165741091627091488_n.jpg?stp=c0.0.480.480a_dst-jpg_p480x480&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeG8imyYrHCUqF5ake1tKTRRMrFqPMEkK9MysWo8wSQr080S1jCg9Qi4KV8VmOVUrYCO93pjfSdUjNSw-fUJ0u3_&_nc_ohc=2roiJZxvm9UQ7kNvgHYbKTZ&_nc_ht=scontent.fsgn5-10.fna&oh=00_AYC-uwHmXJMEFyb8VXjDiW_4IWUCv8lWfm7SiJ3wRQq4vA&oe=6647A919" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
