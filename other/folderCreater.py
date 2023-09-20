import pandas as pd
import os


parent_dir = os.path.dirname(__file__) + "/"

#name of csv file
df = pd.read_csv("changeMe.csv")


#change name of title, here: "changeMe_Task"
for i in range(df["changeMe_Task"].count()):
    
    count = 0
    #change name of title, here: "ChangeMe_Difficulty"
    challengePath = os.path.join(parent_dir, "a" + str(int(df.loc[i, ["ChangeMe_Difficulty"]])))

    if os.path.isdir(challengePath):

        for path in os.listdir(challengePath):
            if os.path.isfile(os.path.join(challengePath, path)):
                count += 1

        f = open(str(challengePath) + "/" + str(count) + ".txt", "w")

        #change name of title, here: "changeMe_Task"
        f.write(str(df.loc[i]["changeMe_Task"]))
        f.close
        
    else:
        os.makedirs(challengePath)
        f = open(str(challengePath) + "/" + str(count) + ".txt", "w")

        #change name of title, here: "changeMe_Task"
        f.write(str(df.loc[i]["changeMe_Task"]))
        f.close
