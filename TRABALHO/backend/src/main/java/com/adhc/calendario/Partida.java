package com.adhc.calendario;

public record Partida(
    String date,
    String title,
    String time,
    String location,
    String category,
    String status,
    String description
) {
}