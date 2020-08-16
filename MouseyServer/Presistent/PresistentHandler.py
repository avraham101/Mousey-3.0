import os

class PresistentGenerationHandler:

    def __init__(self):
        self.path = './generations'
        self.generation_counter = self.number_of_generations()

    def number_of_generations(self):
        if os.path.isdir(self.path) is False:
            os.mkdir(self.path)
        arr = os.listdir(self.path)
        return len(arr)

    def save_generation(self, dataFrame):
        path = self.path
        path += '/gen' + str(self.generation_counter)
        path += '.csv'
        while os.path.isfile(path):
            self.generation_counter += 1
            path = self.path
            path += '/gen' + str(self.generation_counter)
            path += '.csv'
        print('save in path', path)
        dataFrame.to_csv(path)
        self.generation_counter += 1
