import React, { useState } from 'react';
import { 
  Box, Typography, Breadcrumbs, Link, Switch, Chip, Button, 
  Card, CardContent, CardMedia, Divider, Stack, Paper, IconButton, Collapse 
} from '@mui/material';
import { 
  Home as HomeIcon, 
  NotificationsNone as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon
} from '@mui/icons-material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';

// Imagem física da sua pasta assets
import CupulaImage from '../assets/image_cupula.png'; 

const SCHIBSTED = '"Schibsted Grotesk", sans-serif';
const PRIMARY_BLUE = '#0072C3';
const STABLE_GREEN = '#70BF54';
const WARNING_ORANGE = '#E87727';

const BAR_O2 = '#33B1FF';
const BAR_CO2 = '#F4CE49';
const BAR_CH4 = '#A165FD';
const BAR_H2S = '#FF9C55';

// --- Sub-componente de Item de Alerta ---
const AlertItem = ({ label, time, unit, type }: any) => (
  <Box sx={{ width: '100%', py: 1.2, borderBottom: '1px solid rgba(0, 0, 0, 0.04)' }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
      <Box sx={{ 
        p: 0.8, borderRadius: '50%', display: 'flex', flexShrink: 0,
        bgcolor: type === 'warning' ? 'rgba(232, 119, 39, 0.08)' : 'rgba(112, 191, 84, 0.08)' 
      }}>
        {type === 'warning' ? 
          <ErrorIcon sx={{ color: WARNING_ORANGE, fontSize: 18 }} /> : 
          <CheckCircleIcon sx={{ color: STABLE_GREEN, fontSize: 18 }} />
        }
      </Box>
      <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: SCHIBSTED, color: 'black', whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'rgba(0, 0, 0, 0.38)', fontFamily: SCHIBSTED, whiteSpace: 'nowrap', ml: 1 }}>
          {unit} - {time}
        </Typography>
      </Box>
    </Stack>
  </Box>
);

// --- Gráfico de Sensores ---
const SensorChart = ({ chartColor, chartData, unit }: any) => (
  <Box sx={{ height: 160, width: '100%', mt: 1 }}>
    <LineChart
      series={[{ data: chartData, color: chartColor, showMark: false, area: false }]}
      xAxis={[{ 
        scaleType: 'point', 
        data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'], 
        tickLabelStyle: { fontSize: 10, fontFamily: SCHIBSTED, fill: 'rgba(0,0,0,0.6)' } 
      }]}
      yAxis={[{ 
        id: 'leftAxisId',
        width: 48, 
        min: 0, max: 200,
        tickLabelStyle: { fontSize: 10, fontFamily: SCHIBSTED, fill: 'rgba(0,0,0,0.6)' },
        valueFormatter: (v: number) => `${v}${unit}` 
      }]}
      height={160} 
      margin={{ left: 50, right: 10, top: 10, bottom: 25 }}
      sx={{ 
        '& .MuiChartsAxis-left .MuiChartsAxis-line': { stroke: 'rgba(0,0,0,0.87)' },
        '& .MuiChartsAxis-bottom .MuiChartsAxis-line': { stroke: 'rgba(0,0,0,0.87)' }
      }}
    />
  </Box>
);

// --- Bloco de Sensor ---
const SensorBlock = ({ label, value, unit, status, color, chartData }: any) => (
  <Paper elevation={0} sx={{ p: 2, bgcolor: '#FBFBFB', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', mb: 3 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontSize: 18, fontWeight: 700, fontFamily: SCHIBSTED }}>{label}</Typography>
      <Chip label={status} size="small" sx={{ bgcolor: color, color: 'white', fontWeight: 600, fontSize: 10, height: 22 }} />
    </Stack>
    <Box sx={{ mb: 1 }}>
      <Typography component="span" sx={{ fontSize: 38, fontWeight: 400, fontFamily: SCHIBSTED }}>{value}</Typography>
      <Typography component="span" sx={{ fontSize: 20, color: 'rgba(0,0,0,0.6)', ml: 0.5 }}>{unit}</Typography>
    </Box>
    <Divider />
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'black', fontFamily: SCHIBSTED, mt: 1, opacity: 0.6 }}>ÚLTIMAS 24 HORAS</Typography>
    <SensorChart chartColor={color} chartData={chartData} unit={unit} />
  </Paper>
);

// --- TELA DE DETALHES ---
const PlantaDetails = ({ planta }: any) => {
  const [expanded, setExpanded] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const alertas = planta?.alerts || [];

  return (
    <Box sx={{ width: '100%', maxWidth: '1447px', mx: 'auto', pb: 10 }}>
      {/* Header Detalhes */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3, height: 64 }}>
        <Box sx={{ width: 10, height: 32, bgcolor: PRIMARY_BLUE, borderRadius: '2px' }} />
        <Typography sx={{ fontSize: 24, fontWeight: 600, flexGrow: 1, fontFamily: SCHIBSTED }}>{planta.title}</Typography>
        <Chip label={<span>Ciclo <b>{planta.cycle}</b> - atualizado <b>{planta.updatedAt}</b></span>} sx={{ bgcolor: '#F1F3F4', height: 32, fontSize: 13, fontFamily: SCHIBSTED }} />
      </Stack>

      <Box sx={{ position: 'relative', width: '100%', borderRadius: '4px', overflow: 'hidden', mb: 4 }}>
        <CardMedia component="img" image={CupulaImage} sx={{ width: '100%', height: '468px', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(255,255,255,0.75)', p: 2, display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ color: 'rgba(0,0,0,0.54)', mr: 1 }} />
          <Typography sx={{ flexGrow: 1, fontFamily: SCHIBSTED, fontSize: 16 }}>Alertas recentes</Typography>
          <Switch checked={alertsEnabled} onChange={(e) => setAlertsEnabled(e.target.checked)} />
        </Box>
      </Box>

      <Stack spacing={4}>
        <Collapse in={alertsEnabled}>
          {alertas.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', bgcolor: '#FBFBFB', border: '1px solid #eee', boxShadow: '0px 2px 6px rgba(0,0,0,0.15)' }}>
               <Stack direction="row" justifyContent="space-between" alignItems="center">
                 <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: SCHIBSTED }}>Alertas</Typography>
                 <IconButton onClick={() => setExpanded(!expanded)}><ArrowDownIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none' }} /></IconButton>
               </Stack>
               <Divider sx={{ my: 2 }} />
               {alertas.slice(0, 5).map((a: any, i: number) => <AlertItem key={i} {...a} />)}
               <Collapse in={expanded}>{alertas.slice(5).map((a: any, i: number) => <AlertItem key={i} {...a} />)}</Collapse>
               <Button fullWidth onClick={() => setExpanded(!expanded)} sx={{ color: PRIMARY_BLUE, fontWeight: 700, mt: 2 }}>{expanded ? 'MOSTRAR MENOS' : 'VER TODOS OS ALERTAS'}</Button>
            </Paper>
          )}
        </Collapse>

        {/* 4 Sensores Lado a Lado (Grid 2x2) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
          {planta.sensors.map((s: any, idx: number) => (
            <SensorBlock key={idx} {...s} />
          ))}
        </Box>

        {/* ✅ SOLUÇÃO DEFINITIVA: POSICIONAMENTO ABSOLUTO IDÊNTICO AO SEU HTML DE REFERÊNCIA */}
        <Box sx={{ display: 'flex', gap: '24px', width: '100%', justifyContent: 'space-between' }}>
          
          {/* CARD 1: CONCENTRAÇÃO ATUAL DOS GASES */}
          <Paper elevation={0} sx={{ position: 'relative', width: '703px', height: '534px', borderRadius: '20px', bgcolor: '#FBFBFB', boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.20), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }}>
            
            <Typography sx={{ position: 'absolute', left: 24, top: 24, fontSize: 24, fontWeight: 700, fontFamily: SCHIBSTED, color: 'black' }}>
              Concentração atual dos gases O₂, CO₂, CH₄ e H₂S
            </Typography>
            <Divider sx={{ position: 'absolute', left: 0, top: 56, width: '100%', borderColor: 'rgba(0,0,0,0.05)' }} />

            {/* O2 */}
            <Box sx={{ position: 'absolute', left: 24, top: 105, width: 655 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 600, color: 'black'}}>O₂</span> <span style={{fontSize: 24, fontWeight: 600, color: 'rgba(0,0,0,0.6)'}}>(Oxigênio)</span></Typography>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 700, color: 'black'}}>2</span><span style={{fontSize: 20, fontWeight: 400, color: 'rgba(0,0,0,0.6)'}}>%</span></Typography>
              </Stack>
              <Box sx={{ height: 12, bgcolor: '#F1F3F4', borderRadius: 8, pr: '637px' }}><Box sx={{ width: '100%', height: '100%', bgcolor: BAR_O2, borderRadius: 8 }} /></Box>
            </Box>

            {/* CO2 */}
            <Box sx={{ position: 'absolute', left: 24, top: 209, width: 655 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 600, color: 'black'}}>CO₂</span> <span style={{fontSize: 24, fontWeight: 600, color: 'rgba(0,0,0,0.6)'}}>(Gás Carbônico)</span></Typography>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 700, color: 'black'}}>27</span><span style={{fontSize: 20, fontWeight: 400, color: 'rgba(0,0,0,0.6)'}}>%</span></Typography>
              </Stack>
              <Box sx={{ height: 12, bgcolor: '#F1F3F4', borderRadius: 8, pr: '563px' }}><Box sx={{ width: '100%', height: '100%', bgcolor: BAR_CO2, borderRadius: 8 }} /></Box>
            </Box>

            {/* CH4 */}
            <Box sx={{ position: 'absolute', left: 24, top: 313, width: 655 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 600, color: 'black'}}>CH₄</span> <span style={{fontSize: 24, fontWeight: 600, color: 'rgba(0,0,0,0.6)'}}>(Metano)</span></Typography>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 700, color: 'black'}}>71</span><span style={{fontSize: 20, fontWeight: 400, color: 'rgba(0,0,0,0.6)'}}>%</span></Typography>
              </Stack>
              <Box sx={{ height: 12, bgcolor: '#F1F3F4', borderRadius: 8, pr: '52px' }}><Box sx={{ width: '100%', height: '100%', bgcolor: BAR_CH4, borderRadius: 8 }} /></Box>
            </Box>

            {/* H2S */}
            <Box sx={{ position: 'absolute', left: 24, top: 417, width: 655 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 600, color: 'black'}}>H₂S</span> <span style={{fontSize: 24, fontWeight: 600, color: 'rgba(0,0,0,0.6)'}}>(Sulfeto de Hidrogênio)</span></Typography>
                <Typography sx={{ fontFamily: SCHIBSTED }}><span style={{fontSize: 24, fontWeight: 700, color: 'black'}}>187</span><span style={{fontSize: 20, fontWeight: 400, color: 'rgba(0,0,0,0.6)'}}>ppm</span></Typography>
              </Stack>
              <Box sx={{ height: 12, bgcolor: '#F1F3F4', borderRadius: 8, pr: '96px' }}><Box sx={{ width: '100%', height: '100%', bgcolor: BAR_H2S, borderRadius: 8 }} /></Box>
            </Box>
          </Paper>

          {/* CARD 2: GRÁFICO ANUAL DOS ELEMENTOS */}
          <Paper elevation={0} sx={{ position: 'relative', width: '703px', height: '534px', borderRadius: '20px', bgcolor: '#FBFBFB', boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.20), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' }}>
            
            <Typography sx={{ position: 'absolute', left: 24, top: 24, fontSize: 24, fontWeight: 700, fontFamily: SCHIBSTED, color: 'black' }}>
              Gráfico anual dos elementos O₂, CO₂ e CH₄
            </Typography>
            <Divider sx={{ position: 'absolute', left: 0, top: 56, width: '100%', borderColor: 'rgba(0,0,0,0.05)' }} />

            {/* Legenda cravada na posição absoluta */}
            <Stack direction="row" spacing={3} sx={{ position: 'absolute', right: 24, top: 28 }}>
              <Stack direction="row" alignItems="center" spacing={1}><Box sx={{ width: 16, height: 16, bgcolor: BAR_O2, borderRadius: '2px' }} /><Typography sx={{fontFamily: SCHIBSTED, fontWeight: 600}}>O₂</Typography></Stack>
              <Stack direction="row" alignItems="center" spacing={1}><Box sx={{ width: 16, height: 16, bgcolor: BAR_CO2, borderRadius: '2px' }} /><Typography sx={{fontFamily: SCHIBSTED, fontWeight: 600}}>CO₂</Typography></Stack>
              <Stack direction="row" alignItems="center" spacing={1}><Box sx={{ width: 16, height: 16, bgcolor: BAR_CH4, borderRadius: '2px' }} /><Typography sx={{fontFamily: SCHIBSTED, fontWeight: 600}}>CH₄</Typography></Stack>
            </Stack>

            {/* ✅ Gráfico cravado com Width e Height absolutos. NUNCA MAIS VAI QUEBRAR! */}
            <Box sx={{ position: 'absolute', left: 24, top: 80, width: 655, height: 430 }}>
              <BarChart 
                width={655} 
                height={430} 
                layout="horizontal" 
                yAxis={[{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], tickLabelStyle: { fontFamily: SCHIBSTED, fontSize: 12 }, width: 48 }]}
                xAxis={[{ max: 100, tickLabelStyle: { fontFamily: SCHIBSTED, fontSize: 12 }, valueFormatter: (v: number) => `${v}%` }]}
                series={[
                  { data: [5, 10, 5, 10, 5, 10, 5, 10, 5, 10, 5, 10], color: BAR_O2, stack: 'total' },
                  { data: [20, 25, 20, 25, 20, 25, 20, 25, 20, 25, 20, 25], color: BAR_CO2, stack: 'total' },
                  { data: [50, 40, 50, 40, 50, 40, 50, 40, 50, 40, 50, 40], color: BAR_CH4, stack: 'total' }
                ]} 
                margin={{ left: 48, right: 10, top: 10, bottom: 25 }}
                sx={{
                  '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': { fill: 'rgba(0,0,0,0.87)' },
                  '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': { fill: 'rgba(0,0,0,0.87)' },
                  '& .MuiChartsAxis-left .MuiChartsAxis-line': { stroke: 'rgba(0,0,0,0.87)' },
                  '& .MuiChartsAxis-bottom .MuiChartsAxis-line': { stroke: 'rgba(0,0,0,0.87)' }
                }}
              />
            </Box>
          </Paper>

        </Box>
      </Stack>
    </Box>
  );
};

// --- CARD DA LISTA PRINCIPAL ---
const MonitoringCard = ({ planta, onDetail }: any) => {
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const alertas = planta?.alerts || [];

  return (
    <Card sx={{ width: '100%', maxWidth: 384, borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: '16px', height: 64 }}>
        <Box sx={{ width: 8, height: 32, bgcolor: PRIMARY_BLUE, borderRadius: '2px' }} />
        <Typography sx={{ fontSize: 22, fontWeight: 600, flexGrow: 1, fontFamily: SCHIBSTED }}>{planta.title}</Typography>
        <Chip label={<span>Ciclo <b>{planta.cycle}</b> - atualizado <b>{planta.updatedAt}</b></span>} sx={{ bgcolor: '#F1F3F4', height: 26, fontSize: 11, fontFamily: SCHIBSTED }} />
      </Stack>
      <Box sx={{ position: 'relative', width: '100%', height: 279 }}>
        <CardMedia component="img" image={CupulaImage} sx={{ width: '100%', height: '279px', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(255,255,255,0.85)', p: 1.5, display: 'flex', alignItems: 'center' }}>
          <NotificationsIcon sx={{ color: 'rgba(0,0,0,0.54)', mr: 1 }} />
          <Typography sx={{ flexGrow: 1, fontFamily: SCHIBSTED, fontSize: 15 }}>Alertas recentes</Typography>
          <Switch checked={alertsEnabled} onChange={(e) => setAlertsEnabled(e.target.checked)} size="small" />
        </Box>
      </Box>
      <CardContent sx={{ p: '24px' }}>
        <Collapse in={alertsEnabled}>
          <Box sx={{ mb: 3, p: '16px', bgcolor: '#FBFBFB', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
               <Typography sx={{ fontSize: 18, fontWeight: 700, fontFamily: SCHIBSTED }}>Alertas</Typography>
               <IconButton onClick={() => setExpanded(!expanded)} size="small">{expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}</IconButton>
            </Stack>
            <Divider sx={{ my: 1 }} />
            {alertas.slice(0, 5).map((a: any, i: number) => <AlertItem key={i} {...a} />)}
            <Collapse in={expanded}>{alertas.slice(5).map((a: any, i: number) => <AlertItem key={i} {...a} />)}</Collapse>
            <Button fullWidth onClick={() => setExpanded(!expanded)} sx={{ mt: 1, color: PRIMARY_BLUE, fontWeight: 700, fontFamily: SCHIBSTED, fontSize: 12 }}>
               {expanded ? 'MOSTRAR MENOS' : 'VER TODOS OS ALERTAS'}
            </Button>
          </Box>
        </Collapse>
        {planta.sensors.map((s: any, idx: number) => <SensorBlock key={idx} {...s} />)}
      </CardContent>
      <Box sx={{ p: '24px', pt: 0, mt: 'auto' }}>
        <Button fullWidth variant="outlined" sx={{ height: 48, fontWeight: 700, fontFamily: SCHIBSTED, textTransform: 'uppercase', borderColor: 'rgba(0,114,195,0.5)' }} onClick={onDetail}>
          MOSTRAR DETALHES
        </Button>
      </Box>
    </Card>
  );
};

export const Monitoramento: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedPlanta, setSelectedPlanta] = useState<any>(null);

  const mockData = [10, 45, 80, 100, 120, 60, 71];

  const getSensors = (ch4: string, co2: string, o2: string, h2s: string, status: string, color: string) => [
    { label: 'CH4', value: ch4, unit: '%', status: status, color: color, chartData: mockData },
    { label: 'CO2', value: co2, unit: '%', status: status, color: color, chartData: [20, 25, 27, 26, 27, 27, 27] },
    { label: 'O2', value: o2, unit: '%', status: status, color: color, chartData: [5, 10, 2, 8, 2, 2, 2] },
    { label: 'H2S', value: h2s, unit: 'ppm', status: status, color: color, chartData: [100, 150, 180, 200, 190, 170, 201] }
  ];

  const plants = [
    { 
      id: 1, title: "BIO 1", cycle: 32, updatedAt: "19:03", 
      alerts: [
        { label: 'Ciclo de medição', time: '09:46', unit: 'BIO 1', type: 'success' },
        { label: 'H2S acima do limite', time: '12:03', unit: 'BIO 1', type: 'warning' },
        { label: 'O2 acima do limite', time: '06:52', unit: 'BIO 3', type: 'warning' },
        { label: 'CO2 acima do limite', time: '20:41', unit: 'BIO 2', type: 'warning' },
        { label: 'CH4 abaixo do limite', time: '22:14', unit: 'BIO 2', type: 'warning' },
        { label: 'O2 acima do limite', time: '11:52', unit: 'BIO 3', type: 'warning' }
      ],
      sensors: getSensors('71', '27', '2', '201', 'ESTÁVEL', STABLE_GREEN) 
    },
    { 
      id: 2, title: "BIO 2", cycle: 31, updatedAt: "18:39", alerts: [],
      sensors: getSensors('73', '26', '1', '165', 'ESTÁVEL', STABLE_GREEN) 
    },
    { 
      id: 3, title: "BIO 3", cycle: 30, updatedAt: "18:24", alerts: [],
      sensors: getSensors('52', '36', '12', '534', 'INSTÁVEL', WARNING_ORANGE) 
    }
  ];

  const handleBack = () => { setView('list'); setSelectedPlanta(null); };

  return (
    <Box sx={{ p: '40px 60px', bgcolor: '#F5F5F5', minHeight: '100vh', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* BREADCRUMB CORRIGIDO (Navegável com /) */}
      <Breadcrumbs separator={<Typography sx={{ color: 'rgba(0,0,0,0.38)', mx: 0.5 }}>/</Typography>} sx={{ mb: 1 }}>
        <Link 
          onClick={handleBack} 
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.54)' }}
        >
          <HomeIcon sx={{ fontSize: 20 }} />
        </Link>
        <Typography sx={{ fontFamily: SCHIBSTED, fontSize: 16, color: 'rgba(0,0,0,0.38)' }}>...</Typography>
        <Link 
          onClick={handleBack} 
          sx={{ cursor: 'pointer', fontFamily: SCHIBSTED, fontSize: 16, color: view === 'list' ? 'black' : 'rgba(0,0,0,0.54)', textDecoration: 'none' }}
        >
          Monitoramento
        </Link>
        {view === 'detail' && <Typography sx={{ fontFamily: SCHIBSTED, fontSize: 16, color: 'black' }}>{selectedPlanta?.title}</Typography>}
      </Breadcrumbs>

      <Typography variant="h1" sx={{ fontSize: 48, fontWeight: 400, mb: 4, fontFamily: SCHIBSTED, color: 'black' }}>Monitoramento</Typography>
      
      {view === 'list' ? (
        // GARANTIA DO SEU GRID ESTÁVEL (repeat 3, 1fr) SEM SCROLL LATERAL
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '80px', width: '100%', alignItems: 'flex-start' }}>
          {plants.map((p) => (
            <MonitoringCard key={p.id} planta={p} onDetail={() => { setSelectedPlanta(p); setView('detail'); }} />
          ))}
        </Box>
      ) : (
        <PlantaDetails planta={selectedPlanta} />
      )}

    </Box>
  );
};

export default Monitoramento;