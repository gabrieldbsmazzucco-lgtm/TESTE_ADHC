package com.adhc.calendario;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partidas")
// Apenas o domínio configurado pode chamar a API (sem o "*" aberto)
@CrossOrigin(origins = "${adhc.cors.allowed-origin}")
public class PartidaController {

  private final PartidaService partidaService;
  private final AdminAuthService adminAuthService;
  private final JwtService jwtService;

  public PartidaController(
      PartidaService partidaService,
      AdminAuthService adminAuthService,
      JwtService jwtService) {
    this.partidaService = partidaService;
    this.adminAuthService = adminAuthService;
    this.jwtService = jwtService;
  }

  // ── Público ──────────────────────────────────────────────────────────────

  /** Lista todas as partidas. Qualquer visitante pode acessar. */
  @GetMapping
  public List<Partida> listar() {
    return partidaService.listar();
  }

  // ── Admin: login ─────────────────────────────────────────────────────────

  /**
   * Recebe usuário e senha UMA vez.
   * Devolve um token JWT que será usado nas próximas requisições.
   * A senha nunca mais viaja depois disso.
   */
  @PostMapping("/login")
  public Map<String, String> login(
      @RequestHeader("X-Admin-User") String username,
      @RequestHeader("X-Admin-Pass") String password) {
    adminAuthService.exigirAcesso(username, password);
    String token = jwtService.gerarToken();
    return Map.of("token", token);
  }

  // ── Admin: operações protegidas por token ─────────────────────────────────

  /**
   * Substitui todas as partidas. Requer token válido no header:
   * Authorization: Bearer <token>
   */
  @PutMapping
  public List<Partida> salvar(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody List<Partida> partidas) {
    jwtService.exigirToken(authHeader);
    return partidaService.salvar(partidas);
  }

  /**
   * Restaura as partidas padrão. Requer token válido no header:
   * Authorization: Bearer <token>
   */
  @PostMapping("/reset")
  public List<Partida> resetar(
      @RequestHeader("Authorization") String authHeader) {
    jwtService.exigirToken(authHeader);
    return partidaService.resetar();
  }
}