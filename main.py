from flask import Flask, render_template, jsonify, request

web_site = Flask(__name__)

def before_request():
    web_site.jinja_env.cache = {}

@web_site.route('/')
def index():
    return render_template('index.html')

@web_site.route('/learn')
def learn():
    return render_template('learn.html')


@web_site.route('/webhook', methods=['POST'])
def webhook():
    req = request.get_json(silent=True, force=True)
    fulfillmentText = ''
    query_result = req.get('queryResult')
    if query_result.get('action') == 'ops.numeric':
        op = query_result.get('parameters').get('ops')
        vals = query_result.get('parameters').get('number')
        fulfillmentText = '{}ing these numbers: {}'.format(op, vals);
        print(fulfillmentText)
    elif query_result.get('action') == 'attr.color':
        colorcmd = query_result.get('parameters').get('colorcommand')
        col = query_result.get('parameters').get('color')
        fulfillmentText = "Changing the {} color with {}.".format(colorcmd, col)
        print(fulfillmentText)
    elif query_result.get('action') == 'draw.shape':
        shape = query_result.get('parameters').get('shape')
        vals = query_result.get('parameters').get('number')
        fulfillmentText = "Drawing {} on canvas".format(shape)
        print(fulfillmentText)
    elif query_result.get('action') == 'variable.define':
        varname = query_result.get('parameters').get('varname')
        varval = query_result.get('parameters').get('varval')
        fulfillmentText = "Created variable {} with value: {}".format(varname, varval)
        print(fulfillmentText)
    return jsonify({
        "fulfillmentText": fulfillmentText,
        "displayText": '40',
        "source": "webhookdata"
    })

web_site.run(host='0.0.0.0', port=8080)
