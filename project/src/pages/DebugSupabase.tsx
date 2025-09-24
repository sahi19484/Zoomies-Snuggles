import React, { useEffect, useState } from 'react'
import supabase, { authHelpers } from '../lib/supabase'

export default function DebugSupabase() {
  const [logs, setLogs] = useState([])

  const add = (msg) => setLogs((s) => [...s, msg])

  useEffect(() => {
    (async () => {
      add('Starting Supabase debug...')

      // Check config
      try {
        const url = supabase._url || ''
        add(`Supabase URL: ${url}`)
      } catch (err) {
        add(`Supabase URL: could not read (internal)`)
      }

      // Check session
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          add(`getSession error: ${sessionError.message}`)
        } else if (!sessionData?.session) {
          add('No active auth session')
        } else {
          add('Active auth session found')
        }
      } catch (err) {
        add(`getSession threw: ${err.message || err}`)
      }

      // Check getUser
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError) add(`getUser error: ${userError.message}`)
        else add(`getUser: ${JSON.stringify(userData?.user || null)}`)
      } catch (err) {
        add(`getUser threw: ${err.message || err}`)
      }

      // Test fetch to REST endpoint to detect CORS/network
      try {
        const base = (supabase._url || '').replace(/\/$/, '')
        const testUrl = base + '/rest/v1/?' // expected to return 400 or CORS, but will test network
        add(`Testing fetch to: ${testUrl}`)
        const res = await fetch(testUrl, {
          method: 'GET',
          headers: {
            apikey: (process.env.VITE_SUPABASE_ANON_KEY || window.__env?.VITE_SUPABASE_ANON_KEY) || '',
            Authorization: `Bearer ${(process.env.VITE_SUPABASE_ANON_KEY || window.__env?.VITE_SUPABASE_ANON_KEY) || ''}`
          }
        })
        add(`Fetch status: ${res.status}`)
        try {
          const text = await res.text()
          add(`Fetch response (truncated): ${text.slice(0, 500)}`)
        } catch (e) {
          add('Could not read fetch response body')
        }
      } catch (err) {
        add(`Fetch test threw: ${err.message || err}`)
        add('Likely a network/CORS issue. Ensure your Supabase project allows this origin in Authentication -> URL configuration and CORS settings.')
      }

      // Test SDK call to list tables (may be restricted)
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .limit(1)

        if (error) add(`SDK select error: ${error.message}`)
        else add(`SDK select success: ${JSON.stringify(data)}`)
      } catch (err) {
        add(`SDK select threw: ${err.message || err}`)
      }

      add('Debug finished')
    })()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Supabase Debug</h1>
      <div className="bg-white shadow rounded p-4">
        {logs.map((l, i) => (
          <div key={i} className="text-sm mb-2">{l}</div>
        ))}
      </div>
    </div>
  )
}
