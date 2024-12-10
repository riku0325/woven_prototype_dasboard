# EnegyColorign 電力データ取得サンプル

## 共通設定
import requests
import datetime
import pandas as pd
base_url = 'https://wvw4hutwne.execute-api.ap-northeast-1.amazonaws.com/v1/'

key = 'baccd941-ff2f-422a-a7f1-992c69c20a90'
### 取得期間の設定
year = 2023
month = 5
date = 8
span = 2
info_response = requests.get(base_url + 'info?k=' + key)
info = info_response.json()
name1 = info["info"]["name1"] if info["info"]["name1"] != None else info["info"]["name1_initial"]
name2 = info["info"]["name2"] if info["info"]["name2"] != None else info["info"]["name2_initial"]
name = name1 + '/' + name2
if info["info"]["circuit_type"] == 1:
    circuit_type = '単相3線'
elif info["info"]["circuit_type"] == 2:
    circuit_type = '単相2線'
elif info["info"]["circuit_type"] == 3:
    circuit_type = '三相3線'
elif info["info"]["circuit_type"] == 4:
    circuit_type = '三相平衡'
else:
    circuit_type = '単相3線'
line_frequency = info["info"]["line_frequency"]
effective_voltage = info["info"]["effective_voltage"]
ct_ratio = info["info"]["ct_ratio"] if info["info"]["ct_ratio"] != None else info["info"]["ct_ratio_initial"]
power_factor = info["info"]["power_factor"]
fix_phase_factor = math.sqrt(3) if info["info"]["circuit_type"] == 3 or info["info"]["circuit_type"] == 4 else 1
### ラベル情報の取得
label_response = requests.get(base_url + 'disagg_label?k=' + key)
labels_data = label_response.json()
# stack order順に並べなおす
labels = []
for i,item in enumerate(labels_data["merge_model_label"]):
    temp = {'index':i, 'label':item["label"], 'stack_order':item["stack_order"]}
    labels.append(temp)
labels.sort(key=lambda x:x["stack_order"])
### 分離データの取得
# 日付リストの作成
date_list = []
dt = datetime.date(year, month, date)
t1d = datetime.timedelta(days=1)
for i in range(span):
    date_list.append(dt.strftime('%Y%m%d'))
    dt = dt + t1d
data_list = []
for dd in date_list:
    disagg_response = requests.get(base_url + 'disagg_power?k=' + key + '&bin=15min' + '&from=' + dd + '&to=' + dd)
    item = disagg_response.json()
    df = pd.DataFrame(data=item["UnixTime"], columns=['time'])
    df['time'] = pd.to_datetime(df['time'], unit='s', utc=True)
    df['time'] = df['time'].dt.tz_convert('Asia/Tokyo')
    for label in labels:
        df[label['label']] = pd.DataFrame(data=item["DisaggPowers"][label['index']]  ,columns=[label['label']] )
        df[label['label']] = df[label['label']].map(lambda x: 0 if x < 0 else x )
        df[label['label']] = df[label['label']].map(lambda x: x * effective_voltage * ct_ratio * power_factor * fix_phase_factor )
    data_list.append(df)
## データ確認
name
circuit_type
line_frequency
effective_voltage
ct_ratio
power_factor
labels
date_list
for item in data_list:
    print(item.head(2).T)
    print('----------')
## データ出力
for i in range(len(data_list)):
    data_list[i].to_csv('data_'+ date_list[i] +'.csv', encoding='utf_8_sig', index = False)