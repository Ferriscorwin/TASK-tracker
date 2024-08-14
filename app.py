from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# In-memory task storage
tasks = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def task_list():
    if request.method == 'POST':
        task = request.json
        tasks.append(task)
        return jsonify(task), 201

    return jsonify(tasks)

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return '', 204

@app.route('/tasks/<int:task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = True
            return jsonify(task)
    return '', 404

if __name__ == '__main__':
    app.run(debug=True)
