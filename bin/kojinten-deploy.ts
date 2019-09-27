#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { KojintenDeployStack } from '../lib/kojinten-deploy-stack';

const app = new cdk.App();
new KojintenDeployStack(app, 'KojintenDeployStack');
