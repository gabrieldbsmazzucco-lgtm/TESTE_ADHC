package com.adhc.calendario;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

  // Token válido por 8 horas — o admin precisa logar de novo depois disso
  private static final long EXPIRACAO_MS = 8L * 60 * 60 * 1000;

  private final Key chave;

  public JwtService(@Value("${adhc.jwt.secret}") String secret) {
    // A chave precisa ter pelo menos 32 caracteres para HS256
    if (secret.length() < 32) {
      throw new IllegalStateException(
          "ADHC_JWT_SECRET precisa ter pelo menos 32 caracteres.");
    }
    this.chave = Keys.hmacShaKeyFor(secret.getBytes());
  }

  /** Gera um token JWT assinado para o admin. */
  public String gerarToken() {
    Date agora = new Date();
    return Jwts.builder()
        .setSubject("admin")
        .setIssuedAt(agora)
        .setExpiration(new Date(agora.getTime() + EXPIRACAO_MS))
        .signWith(chave, SignatureAlgorithm.HS256)
        .compact();
  }

  /** Valida o token e lança 401 se for inválido ou expirado. */
  public void exigirToken(String authHeader) {
    String token = extrairToken(authHeader);
    try {
      Jwts.parserBuilder()
          .setSigningKey(chave)
          .build()
          .parseClaimsJws(token);
    } catch (JwtException e) {
      throw new ResponseStatusException(
          HttpStatus.UNAUTHORIZED, "Token inválido ou expirado. Faça login novamente.");
    }
  }

  private String extrairToken(String authHeader) {
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    throw new ResponseStatusException(
        HttpStatus.UNAUTHORIZED, "Header Authorization ausente ou mal formatado.");
  }
}