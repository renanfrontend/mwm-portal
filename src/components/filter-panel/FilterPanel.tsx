import React from "react";
import { Box, Select, MenuItem, Button, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";

const COMMON_FONT = { fontFamily: "Schibsted Grotesk" };

export interface FilterPanelProps {
  open: boolean;
  filters: {
    estabelecimento?: string;
    produtor?: string;
    distancia?: string;
    transportadora?: string;
    totalKm?: string;
  };
  onChange: (filters: FilterPanelProps["filters"]) => void;
  onApply: () => void;
  onClear: () => void;
  estabelecimentos?: { id: number; numEstabelecimento: string }[];
  produtores?: string[];
  distancias?: string[];
  totaisKm?: string[];
  transportadoras?: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  open,
  filters,
  onChange,
  onApply,
  onClear,
  estabelecimentos = [],
  produtores = [],
  distancias = [],
  totaisKm = [],
  transportadoras = [],
}) => {

  if (!open) return null;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -180, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 180, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        position: "absolute",
        left: 380,
        top: 8,
        zIndex: 20,
        bgcolor: "#fff",
        borderRadius: "6px",
        boxShadow: "0px 4px 16px rgba(0,0,0,0.18)",
        px: 2,
        py: 1.5,
        minWidth: 720,
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
        ...COMMON_FONT,
      }}
    >

      {/* LINHA DOS SELECTS */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative"
        }}
      >

        {/* seta esquerda */}
        <IconButton
          size="small"
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            left: -18,
            zIndex: 2
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 1,
            overflow: "hidden",
            flex: 1,
            maxWidth: 660,
            whiteSpace: "nowrap",
            ml: 3,
            mr: 3
          }}
        >

          <Select
            size="small"
            value={filters.estabelecimento || ""}
            displayEmpty
            sx={{ width: 170, minWidth: 170 }}
            onChange={(e) =>
              onChange({ ...filters, estabelecimento: e.target.value })
            }
          >
            <MenuItem value="">Estabelecimento</MenuItem>
            {estabelecimentos.map((e) => (
              <MenuItem key={e.id} value={e.numEstabelecimento}>
                {e.numEstabelecimento}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            value={filters.produtor || ""}
            displayEmpty
            sx={{ width: 150, minWidth: 150 }}
            onChange={(e) =>
              onChange({ ...filters, produtor: e.target.value })
            }
          >
            <MenuItem value="">Produtor</MenuItem>
            {produtores.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            value={filters.distancia || ""}
            displayEmpty
            sx={{ width: 155, minWidth: 155 }}
            onChange={(e) =>
              onChange({ ...filters, distancia: e.target.value })
            }
          >
            <MenuItem value="">Distância (KM)</MenuItem>
            {distancias.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            value={filters.transportadora || ""}
            displayEmpty
            sx={{ width: 160, minWidth: 160 }}
            onChange={(e) =>
              onChange({ ...filters, transportadora: e.target.value })
            }
          >
            <MenuItem value="">Transportadora</MenuItem>
            {transportadoras.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>

          {/* campo escondido no carrossel */}
          <Select
            size="small"
            value={filters.totalKm || ""}
            displayEmpty
            sx={{ width: 140, minWidth: 140 }}
            onChange={(e) =>
              onChange({ ...filters, totalKm: e.target.value })
            }
          >
            <MenuItem value="">Total de KM</MenuItem>
            {totaisKm.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>

        </Box>

        {/* seta direita */}
        <IconButton
          size="small"
          onClick={scrollRight}
          sx={{
            position: "absolute",
            right: -18,
            zIndex: 2
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>

      </Box>

      {/* LINHA DOS BOTÕES */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="text"
          sx={{
            fontWeight: 600,
            color: "#0068B1",
            textTransform: "uppercase",
            ...COMMON_FONT,
          }}
          onClick={onApply}
        >
          APLICAR
        </Button>

        <Button
          variant="text"
          sx={{
            fontWeight: 600,
            color: "#0068B1",
            textTransform: "uppercase",
            ...COMMON_FONT,
          }}
          onClick={onClear}
        >
          REMOVER
        </Button>
      </Box>

    </Box>
  );
};

export default FilterPanel;