package com.adhc.calendario;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PartidaService {

  private static final TypeReference<List<Partida>> LISTA_PARTIDAS = new TypeReference<>() {};

  private final ObjectMapper objectMapper;
  private final Path arquivoPersistencia;

  public PartidaService(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
    Path path = Path.of("data", "partidas.json");
    if (!Files.exists(path) && Files.exists(Path.of("..", "data"))) {
      path = Path.of("..", "data", "partidas.json");
    }
    this.arquivoPersistencia = path;
  }

  public synchronized List<Partida> listar() {
    if (Files.exists(arquivoPersistencia)) {
      try {
        return objectMapper.readValue(arquivoPersistencia.toFile(), LISTA_PARTIDAS);
      } catch (IOException ignored) {
      }
    }
    return carregarPadrao();
  }

  public synchronized List<Partida> salvar(List<Partida> partidas) {
    try {
      Files.createDirectories(arquivoPersistencia.getParent());
      objectMapper.writerWithDefaultPrettyPrinter()
          .writeValue(arquivoPersistencia.toFile(), partidas);
      return partidas;
    } catch (IOException e) {
      throw new IllegalStateException("Não foi possível salvar partidas.", e);
    }
  }

  public synchronized List<Partida> resetar() {
    return salvar(carregarPadrao());
  }

  private List<Partida> carregarPadrao() {
    try (InputStream stream =
        getClass().getClassLoader().getResourceAsStream("partidas-default.json")) {
      if (stream == null) {
        throw new IllegalStateException("Arquivo partidas-default.json não encontrado.");
      }
      return objectMapper.readValue(stream, LISTA_PARTIDAS);
    } catch (IOException e) {
      throw new IllegalStateException("Não foi possível carregar partidas padrão.", e);
    }
  }
}