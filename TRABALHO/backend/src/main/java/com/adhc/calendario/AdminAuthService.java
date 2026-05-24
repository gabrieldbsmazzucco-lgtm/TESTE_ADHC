package com.adhc.calendario;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAuthService {

  private final String adminUser;
  private final String adminPass;

  // Sem valores padrão (:admin / :adhc2026) — se as variáveis de ambiente
  // não estiverem configuradas, o servidor não sobe. Isso é intencional.
  public AdminAuthService(
      @Value("${adhc.admin.username}") String adminUser,
      @Value("${adhc.admin.password}") String adminPass) {
    this.adminUser = adminUser;
    this.adminPass = adminPass;
  }

  public boolean validar(String username, String password) {
    if (username == null || password == null) return false;
    return adminUser.equals(username.trim())
        && normalizar(adminPass).equals(normalizar(password));
  }

  public void exigirAcesso(String username, String password) {
    if (!validar(username, password)) {
      throw new ResponseStatusException(
          HttpStatus.UNAUTHORIZED, "Credenciais de administrador inválidas.");
    }
  }

  private String normalizar(String valor) {
    return valor == null ? "" : valor.replaceAll("\\s+", "");
  }
}