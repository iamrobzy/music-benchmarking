import requests
import io
import os

def get_inference_payload(audio_pathname):

    # Uploading to modal
    # remote_name = 'audiofile'
    # os.system(f'modal volume put music_dir {audio_pathname} {remote_name}')
    # url = 'https://iamrobzy-inference--inference-api-infer-all-models.modal.run'
    # res = requests.post(url=url)
    # return output


    # model_data = some_api_call()
    # data = []

    # maps index to model namemo
    # e.g. if models[0] is "CNN", data[0] should be the probability distribution for the "CNN" model
    # models = []

    # maps index to label name 
    # e.g. if labels[0] is "Rock", data[i][0] should be softmax value for "Rock" of model i
    # labels = []  


    # TODO: Uncomment when function is complete
    # return {
    #             "data": data,
    #             "models": models,
    #             "labels": labels
    #         }

    ### Dummy output

    return {
                "data": [
                    [0.3, 0.4, 0.6, 0.1, 0.3, 0.4, 0.6, 0.1], # probability of each label for "CNN"
                    [0.1, 0.9, 0.4, 0.05, 0.1, 0.3, 0.4, 0.05], # probability of each label for "CNN-2"
                    [0.1, 0.5, 0.3, 0.01, 0.1, 0.5, 0.3, 0.01],
                    [0.4, 0.8, 0.6, 0.2, 0.4, 0.8, 0.6, 0.2],
                    [0.06, 0.6, 0.1, 0.07, 0.06, 0.6, 0.1, 0.07]
                ],
                "models": ["CNN", "CNN-2", "Audio-Mamba", "AST", "UserModel"],
                "labels": ["Pop", "Rock", "Country", "R&B", "Soul", "EDM", "Metal", "Jazz"],
            }
