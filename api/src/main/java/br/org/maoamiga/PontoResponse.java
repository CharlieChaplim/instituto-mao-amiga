package br.org.maoamiga;
public record PontoResponse(Long id, String nome, String endereco, String horario,
                            String atendimento, Double latitude, Double longitude) {
    public static PontoResponse de(Ponto p) {
        return new PontoResponse(p.getId(), p.getNome(), p.getEndereco(), p.getHorario(),p.getAtendimento(),p.getLatitude(),p.getLongitude());
    }
}
