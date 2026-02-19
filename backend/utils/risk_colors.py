def get_color(confidence):
    if confidence > 0.7:
        return "red"
    elif confidence > 0.4:
        return "yellow"
    return "green"
