import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FilterListIcon from '@mui/icons-material/FilterList'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import { Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { capitalizeFirstLetter } from '~/utils/formatters'

function BoardBar({ board }) {
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
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        px: 2,
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            icon={<DashboardIcon fontSize='small'/>}
            label={board?.title}
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
        </Tooltip>
        <Chip
          icon={<VpnLockIcon fontSize='small'/>}
          label={capitalizeFirstLetter(board?.type)}
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
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip sx={{ cursor: 'pointer' }} title="Toàn Nguyễn">
            <Avatar alt="Remy Sharp" src="https://cafefcdn.com/thumb_w/640/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Thao Nguyen">
            <Avatar alt="Travis Howard" src="https://bizweb.dktcdn.net/100/303/962/files/87126502-2509242206005371-2073523065622364160-n-f697e400-e8b2-4bb1-9698-d00b50b2d9c3.jpg?v=1627804121650" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Hóng hớt sâu bít">
            <Avatar alt="Hóng hớt sâu bít" src="https://thepet.vn/wp-content/uploads/2023/05/angry_cat_2-scaled-1-1024x683.webp"/>
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Lưu Như">
            <Avatar alt="Lưu Như" src="https://nemthuanviet.com/wp-content/uploads/2023/10/con-meo-ai-cap-2.jpg" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="About Noo Noo">
            <Avatar alt="Trevor Henderson" src="https://thuvienthucung.com/wp-content/uploads/2021/09/Cach-tam-cho-meo-hieu-qua.jpg" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Trevor Henderson">
            <Avatar alt="Trevor Henderson" src="https://petto.vn/wp-content/uploads/2019/09/meo3.jpg" />
          </Tooltip>
          <Tooltip sx={{ cursor: 'pointer' }} title="Trevor Henderson">
            <Avatar alt="Trevor Henderson" src="https://phunuvietnam.mediacdn.vn/179072216278405120/2023/4/15/16815395266002137006700-16815395536491629462179-1681540601571-16815406016461569455493.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
