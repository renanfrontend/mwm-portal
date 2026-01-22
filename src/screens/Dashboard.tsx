import { Box, Typography } from '@mui/material';
import MetricCard from '../components/MetricCard';

import Thunderstorm from '@mui/icons-material/Thunderstorm';
import Speed from '@mui/icons-material/Speed';
import ChecklistSharp from '@mui/icons-material/ChecklistSharp';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Waves from '@mui/icons-material/Waves';
import LocalGasStation from '@mui/icons-material/LocalGasStation';

const Dashboard = () => {
  const cards = [
    { title: "Precipitação", mainValue: "13mm", icon: <Thunderstorm />, details: [{ label: 'Últimas 24h', value: '0 mm' }, { label: 'Próximas 24h', value: '13 mm' }] },
    { title: "Produtividade do dia", mainValue: "8", secondaryValue: "8h", icon: <Speed />, details: [{ label: 'Em manutenção', value: '2' }, { label: '---', value: '---' }] },
    { title: "Disponibilidade da planta", mainValue: "8", secondaryValue: "8h", icon: <ChecklistSharp />, details: [{ label: 'Em manutenção', value: '0' }, { label: '---', value: '---' }] },
    { title: "Coletas de matéria prima", mainValue: "10", secondaryValue: "24", icon: <LocalShipping />, details: [{ label: 'Cooperados', value: '7' }, { label: '---', value: '---' }] },
    { title: "Volume de matéria prima", mainValue: "3.000(L)", icon: <Waves />, details: [{ label: 'Recebimento em andamento', value: '2' }, { label: '---', value: '---' }] },
    { title: "Abastecimento de biometano", mainValue: "3", secondaryValue: "10", icon: <LocalGasStation />, details: [{ label: 'Em andamento', value: '1' }, { label: 'Volume abastecimento', value: '230,5(M³)' }] },
  ];

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Typography sx={{ fontSize: { xs: '22px', md: '26px', lg: '32px' }, mb: 3, fontFamily: 'Schibsted Grotesk', fontWeight: 400 }}>
        Operação diária
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: { xs: '12px', md: '16px', lg: '24px' }, 
        width: '100%'
      }}>
        {cards.map((card, idx) => (
          <MetricCard key={idx} {...card} />
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;