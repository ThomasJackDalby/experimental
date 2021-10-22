"""main.py"""

import random

NUMBER_OF_PLAYERS = 2
NUMBER_OF_PLAYER_POTS = 6
NUMBER_OF_POTS = NUMBER_OF_PLAYERS * NUMBER_OF_PLAYER_POTS
pots = [4] * NUMBER_OF_POTS
score = [0] * NUMBER_OF_PLAYERS

def get_pots_start_id(player_id):
    return player_id * NUMBER_OF_PLAYER_POTS

def get_pots_end_id(player_id):
    return (player_id + 1) * NUMBER_OF_PLAYER_POTS

def get_player_pots(player_id):
    player_pots_start_id = get_pots_start_id(player_id)
    return pots[player_pots_start_id:player_pots_start_id+NUMBER_OF_PLAYER_POTS]

def check_pot_in_player_range(player_id, pot_id):
    player_pots_start_id = get_pots_start_id(player_id)
    player_pots_end_id = get_pots_end_id(player_id)
    return pot_id >= player_pots_start_id and pot_id < player_pots_end_id

# strategys
def pick_random_non_empty_pot(player_id):
    player_pots = get_player_pots(player_id)
    player_pots_start_id = get_pots_start_id(player_id)
    non_empty_player_pot_ids = [i + player_pots_start_id for i, p in enumerate(player_pots) if p > 0]
    return random.choice(non_empty_player_pot_ids)

def pick_first_non_empty_pot(player_id):
    
    pass

def play(player_a, player_b):
    players = [player_a, player_b]
    player_id = 0
    for turn_id in range(200):
        other_player_id = 1 if player_id == 0 else 0
        player = players[player_id]
        starting_pot_id = player.select_pot(player_id)

        # sow the seeds
        seeds = pots[starting_pot_id]
        pots[starting_pot_id] = 0
        for i in range(seeds):
            pots[(starting_pot_id + 1 + i) % NUMBER_OF_POTS] += 1

        # win opponent pots that have 2/3 seeds in a chain from last pot
        for i in range(seeds, 0, -1):
            pot_id = (starting_pot_id + i) % NUMBER_OF_POTS
            if check_pot_in_player_range(other_player_id, pot_id) and (pots[pot_id] == 2 or pots[pot_id] == 3):
                score[player_id] += pots[pot_id]
                pots[pot_id] = 0
            else:
                break
        
        player_id = other_player_id
    return score

class Player:
    def __init__(self, name, select_pot):
        self.name = name
        self.select_pot = select_pot

PLAYERS = [
    Player("Random", pick_random_non_empty_pot),   
    Player("1st Non-Empty", pick_first_non_empty_pot)   
]

for i in range(len(PLAYERS)):
    for j in range(i, len(PLAYERS)):
        score = play(PLAYERS[i], PLAYERS[j])
        print(i, j, score)