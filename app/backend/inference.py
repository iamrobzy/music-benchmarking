
def get_inference_payload(audio_stream):
    # TODO: Send audio stream to models
    return {
                "data": [
                    [0.3, 0.4, 0.6, 0.1, 0.3, 0.4, 0.6, 0.1],
                    [0.1, 0.9, 0.4, 0.05, 0.1, 0.3, 0.4, 0.05],
                    [0.1, 0.5, 0.3, 0.01, 0.1, 0.5, 0.3, 0.01],
                    [0.4, 0.8, 0.6, 0.2, 0.4, 0.8, 0.6, 0.2],
                    [0.06, 0.6, 0.1, 0.07, 0.06, 0.6, 0.1, 0.07]
                ],
                "models": ["CNN", "CNN-2", "Audio-Mamba", "AST", "UserModel"],
                "labels": ["Pop", "Rock", "Country", "R&B", "Soul", "EDM", "Metal", "Jazz"],
            }
