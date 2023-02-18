#!/bin/bash
ssh oxtickets
source ~/virtualenv/apibully/3.7/bin/activate
cd ~/apibully
flask db upgrade